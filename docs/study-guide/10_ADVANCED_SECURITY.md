# Advanced Security Patterns

This document explains the advanced security patterns and implementation strategies used in the Smart Palms project.

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Threat Modeling](#threat-modeling)
3. [Security Testing](#security-testing)
4. [Compliance and Auditing](#compliance-and-auditing)
5. [Incident Response](#incident-response)

## Security Architecture

### Authentication Flow

```typescript
// src/lib/server/auth/flow.ts
import {error} from "@sveltejs/kit";
import {verifyToken, type JWTPayload} from "./jwt";
import {rateLimit} from "$lib/server/security";
import {logger} from "$lib/utils/logger";

interface AuthFlow {
  validateRequest: (request: Request) => Promise<JWTPayload>;
  enforceRateLimit: (key: string) => Promise<void>;
  validatePermissions: (
    userId: string,
    requiredPermissions: string[]
  ) => Promise<void>;
}

export const authFlow: AuthFlow = {
  async validateRequest(request) {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      throw error(401, "Missing authentication token");
    }

    try {
      return await verifyToken(token);
    } catch (err) {
      logger.error("Token validation failed", {error: err});
      throw error(401, "Invalid authentication token");
    }
  },

  async enforceRateLimit(key) {
    await rateLimit(`auth:${key}`, {
      window: 60 * 1000, // 1 minute
      max: 5,
    });
  },

  async validatePermissions(userId, requiredPermissions) {
    const userPermissions = await getUserPermissions(userId);

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw error(403, "Insufficient permissions");
    }
  },
};
```

### Security Headers

```typescript
// src/hooks.server.ts
import {sequence} from "@sveltejs/kit/hooks";
import {securityHeaders} from "$lib/server/security";

export const handle = sequence(async ({event, resolve}) => {
  const response = await resolve(event);

  // Add security headers
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self' https://api.clerk.dev"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
});
```

## Threat Modeling

### Security Controls

```typescript
// src/lib/server/security/controls.ts
import {z} from "zod";
import {sanitizeHtml} from "$lib/utils/sanitize";
import {validateToken} from "$lib/utils/csrf";

export const securityControls = {
  input: {
    // Input validation schemas
    user: z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(12)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
          "Password must contain uppercase, lowercase, number, and special character"
        ),
    }),

    // Content sanitization
    sanitizeUserInput: (input: string) => {
      return sanitizeHtml(input, {
        allowedTags: ["b", "i", "em", "strong"],
        allowedAttributes: {},
      });
    },
  },

  session: {
    // CSRF protection
    validateCsrfToken: async (token: string) => {
      if (!(await validateToken(token))) {
        throw new Error("Invalid CSRF token");
      }
    },

    // Session management
    validateSession: async (sessionId: string) => {
      const session = await getSession(sessionId);
      if (!session || session.expiresAt < new Date()) {
        throw new Error("Invalid or expired session");
      }
      return session;
    },
  },

  access: {
    // Role-based access control
    checkPermission: async (userId: string, permission: string) => {
      const user = await getUser(userId);
      if (!user.permissions.includes(permission)) {
        throw new Error("Permission denied");
      }
    },

    // Resource ownership
    validateOwnership: async (
      userId: string,
      resourceId: string,
      resourceType: string
    ) => {
      const resource = await getResource(resourceType, resourceId);
      if (resource.userId !== userId) {
        throw new Error("Resource access denied");
      }
    },
  },
};
```

## Security Testing

### Security Test Cases

```typescript
// tests/security/auth.test.ts
import {describe, it, expect} from "vitest";
import {authFlow} from "$lib/server/auth/flow";
import {createTestRequest} from "$test/utils";

describe("Authentication Security", () => {
  describe("Token Validation", () => {
    it("should reject missing tokens", async () => {
      const request = createTestRequest();

      await expect(authFlow.validateRequest(request)).rejects.toThrow(
        "Missing authentication token"
      );
    });

    it("should reject invalid tokens", async () => {
      const request = createTestRequest({
        headers: {
          Authorization: "Bearer invalid.token.here",
        },
      });

      await expect(authFlow.validateRequest(request)).rejects.toThrow(
        "Invalid authentication token"
      );
    });

    it("should reject expired tokens", async () => {
      const expiredToken = createExpiredToken();
      const request = createTestRequest({
        headers: {
          Authorization: `Bearer ${expiredToken}`,
        },
      });

      await expect(authFlow.validateRequest(request)).rejects.toThrow(
        "Token expired"
      );
    });
  });

  describe("Rate Limiting", () => {
    it("should block excessive attempts", async () => {
      const key = "test-user";

      // Make multiple requests
      for (let i = 0; i < 5; i++) {
        await authFlow.enforceRateLimit(key);
      }

      // Next request should fail
      await expect(authFlow.enforceRateLimit(key)).rejects.toThrow(
        "Too many requests"
      );
    });
  });
});

// tests/security/xss.test.ts
describe("XSS Prevention", () => {
  it("should sanitize malicious input", () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = securityControls.input.sanitizeUserInput(maliciousInput);

    expect(sanitized).not.toContain("<script>");
  });

  it("should allow safe HTML", () => {
    const safeInput = "<strong>Hello</strong>";
    const sanitized = securityControls.input.sanitizeUserInput(safeInput);

    expect(sanitized).toBe(safeInput);
  });
});

// tests/security/csrf.test.ts
describe("CSRF Protection", () => {
  it("should validate CSRF tokens", async () => {
    const validToken = await generateCsrfToken();

    await expect(
      securityControls.session.validateCsrfToken(validToken)
    ).resolves.not.toThrow();
  });

  it("should reject invalid CSRF tokens", async () => {
    await expect(
      securityControls.session.validateCsrfToken("invalid-token")
    ).rejects.toThrow("Invalid CSRF token");
  });
});
```

## Compliance and Auditing

### Audit Logging

```typescript
// src/lib/server/audit/index.ts
import {db} from "$lib/server/db";
import {logger} from "$lib/utils/logger";

interface AuditEvent {
  type: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  action: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export class AuditLogger {
  async log(event: Omit<AuditEvent, "timestamp">) {
    try {
      await db.insert(auditLogs).values({
        ...event,
        timestamp: new Date(),
      });

      logger.info("Audit event logged", {event});
    } catch (error) {
      logger.error("Failed to log audit event", {
        error,
        event,
      });
    }
  }

  async query(filters: Partial<AuditEvent>) {
    return db.query.auditLogs.findMany({
      where: filters,
      orderBy: [{timestamp: "desc"}],
    });
  }
}

export const audit = new AuditLogger();

// Usage
async function handleLockerAssignment(lockerId: string, userId: string) {
  await audit.log({
    type: "LOCKER_ASSIGNMENT",
    userId,
    resourceType: "locker",
    resourceId: lockerId,
    action: "assign",
    metadata: {
      assignedAt: new Date(),
    },
  });
}
```

### Data Privacy

```typescript
// src/lib/server/privacy/index.ts
import {createHash} from "crypto";

interface PrivacyConfig {
  retentionPeriod: number; // days
  sensitiveFields: string[];
}

export class PrivacyManager {
  constructor(private config: PrivacyConfig) {}

  maskSensitiveData(data: Record<string, any>) {
    const masked = {...data};

    for (const field of this.config.sensitiveFields) {
      if (field in masked) {
        masked[field] = this.maskValue(masked[field]);
      }
    }

    return masked;
  }

  private maskValue(value: string) {
    if (typeof value !== "string") return value;

    // Keep first and last character, mask the rest
    return (
      value.charAt(0) +
      "*".repeat(Math.max(value.length - 2, 0)) +
      value.charAt(value.length - 1)
    );
  }

  async cleanupExpiredData() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.config.retentionPeriod);

    await db.transaction(async (tx) => {
      // Delete expired audit logs
      await tx.delete(auditLogs).where(lt(auditLogs.timestamp, cutoff));

      // Delete expired user data
      await tx.delete(userData).where(lt(userData.lastAccessed, cutoff));
    });
  }

  hashPII(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }
}

export const privacy = new PrivacyManager({
  retentionPeriod: 90, // 90 days
  sensitiveFields: ["email", "phoneNumber", "address"],
});
```

## Incident Response

### Security Monitoring

```typescript
// src/lib/server/security/monitor.ts
import {logger} from "$lib/utils/logger";
import {notify} from "$lib/utils/notifications";

interface SecurityEvent {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  details: Record<string, any>;
}

export class SecurityMonitor {
  private static readonly ALERT_THRESHOLDS = {
    failedLogins: 5,
    rateLimitExceeded: 10,
    suspiciousIPs: new Set<string>(),
  };

  async trackFailedLogin(userId: string, ip: string) {
    const key = `failed_login:${userId}`;
    const count = await incrementCounter(key);

    if (count >= this.ALERT_THRESHOLDS.failedLogins) {
      await this.raiseSecurityEvent({
        type: "EXCESSIVE_FAILED_LOGINS",
        severity: "high",
        details: {userId, ip, count},
      });
    }
  }

  async trackRateLimit(ip: string) {
    const key = `rate_limit:${ip}`;
    const count = await incrementCounter(key);

    if (count >= this.ALERT_THRESHOLDS.rateLimitExceeded) {
      await this.raiseSecurityEvent({
        type: "RATE_LIMIT_EXCEEDED",
        severity: "medium",
        details: {ip, count},
      });
    }
  }

  async trackSuspiciousIP(ip: string) {
    if (await this.isSuspiciousIP(ip)) {
      this.ALERT_THRESHOLDS.suspiciousIPs.add(ip);

      await this.raiseSecurityEvent({
        type: "SUSPICIOUS_IP_DETECTED",
        severity: "high",
        details: {ip},
      });
    }
  }

  private async raiseSecurityEvent(event: SecurityEvent) {
    // Log event
    logger.error("Security event detected", {event});

    // Notify security team
    await notify("security-team", {
      title: `Security Alert: ${event.type}`,
      body: JSON.stringify(event.details),
      priority: event.severity === "critical" ? "high" : "normal",
    });

    // Store event for analysis
    await db.insert(securityEvents).values({
      ...event,
      timestamp: new Date(),
    });
  }

  private async isSuspiciousIP(ip: string): Promise<boolean> {
    // Check against threat intelligence feeds
    const threatIntel = await checkThreatIntel(ip);
    if (threatIntel.isKnownBad) {
      return true;
    }

    // Check for anomalous behavior
    const analytics = await getIPAnalytics(ip);
    if (
      analytics.requestRate > 100 || // High request rate
      analytics.errorRate > 0.5 || // High error rate
      analytics.uniqueUserAgents > 10 // Multiple user agents
    ) {
      return true;
    }

    return false;
  }
}

export const securityMonitor = new SecurityMonitor();
```

## Next Steps

- Review deployment strategies in [09_ADVANCED_DEPLOYMENT.md](./09_ADVANCED_DEPLOYMENT.md)
- Study testing strategies in [08_ADVANCED_TESTING.md](./08_ADVANCED_TESTING.md)
- Explore error handling in [06_CORE_ERROR_HANDLING.md](./06_CORE_ERROR_HANDLING.md)
