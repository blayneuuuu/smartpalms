# Advanced Deployment Strategies

This document explains the advanced deployment strategies and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [Deployment Architecture](#deployment-architecture)
2. [CI/CD Pipeline](#cicd-pipeline)
3. [Infrastructure as Code](#infrastructure-as-code)
4. [Monitoring and Alerting](#monitoring-and-alerting)
5. [Scaling Strategies](#scaling-strategies)

## Deployment Architecture

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "build"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build:
      context: .
      target: runner
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/smartpalms
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=smartpalms
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  cache:
    image: redis:alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster smartpalms \
            --service app \
            --force-new-deployment
```

## Infrastructure as Code

### Terraform Configuration

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "smartpalms-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

module "ecs" {
  source = "terraform-aws-modules/ecs/aws"

  cluster_name = "smartpalms"

  cluster_configuration = {
    execute_command_configuration = {
      logging = "OVERRIDE"
      log_configuration = {
        cloud_watch_log_group_name = "/aws/ecs/smartpalms"
      }
    }
  }

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 100
      }
    }
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "smartpalms-app"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = 256
  memory                  = 512

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${var.ecr_repository_url}:latest"
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/aws/ecs/smartpalms"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "app"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = "app"
  cluster         = module.ecs.cluster_id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2

  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.app.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight           = 100
  }
}
```

## Monitoring and Alerting

### OpenTelemetry Setup

```typescript
// src/lib/telemetry/index.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "smartpalms",
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-http": {
        enabled: true,
        ignoreIncomingPaths: ["/health"],
      },
      "@opentelemetry/instrumentation-express": {
        enabled: true,
      },
      "@opentelemetry/instrumentation-pg": {
        enabled: true,
      },
    }),
  ],
});

sdk.start();
```

### Prometheus Metrics

```typescript
// src/lib/metrics/index.ts
import { Registry, Counter, Histogram } from "prom-client";

export const registry = new Registry();

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "path", "status"],
  registers: [registry],
});

export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "path"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [registry],
});

// Middleware
export async function metricsMiddleware(
  { request, url }: RequestEvent,
  next: () => Promise<Response>,
) {
  const start = Date.now();
  const method = request.method;
  const path = url.pathname;

  try {
    const response = await next();
    const duration = (Date.now() - start) / 1000;

    httpRequestsTotal.inc({
      method,
      path,
      status: response.status,
    });

    httpRequestDuration.observe({ method, path }, duration);

    return response;
  } catch (error) {
    httpRequestsTotal.inc({
      method,
      path,
      status: 500,
    });
    throw error;
  }
}
```

## Scaling Strategies

### Horizontal Pod Autoscaling

```yaml
# kubernetes/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: smartpalms
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: smartpalms
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 60
```

### Cache Strategy

```typescript
// src/lib/cache/index.ts
import { Redis } from "ioredis";
import { logger } from "$lib/utils/logger";

const redis = new Redis(process.env.REDIS_URL!);

interface CacheConfig {
  ttl?: number;
  prefix?: string;
}

export class Cache {
  constructor(private config: CacheConfig = {}) {}

  private getKey(key: string): string {
    return this.config.prefix ? `${this.config.prefix}:${key}` : key;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(this.getKey(key));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Cache get error", { error, key });
      return null;
    }
  }

  async set(
    key: string,
    value: any,
    ttl: number = this.config.ttl,
  ): Promise<void> {
    try {
      const data = JSON.stringify(value);
      if (ttl) {
        await redis.setex(this.getKey(key), ttl, data);
      } else {
        await redis.set(this.getKey(key), data);
      }
    } catch (error) {
      logger.error("Cache set error", { error, key });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(this.getKey(key));
    } catch (error) {
      logger.error("Cache delete error", { error, key });
    }
  }

  async clear(pattern: string = "*"): Promise<void> {
    try {
      const keys = await redis.keys(this.getKey(pattern));
      if (keys.length) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error("Cache clear error", { error, pattern });
    }
  }
}

// Usage
export const lockerCache = new Cache({
  prefix: "locker",
  ttl: 60 * 5, // 5 minutes
});

export const requestCache = new Cache({
  prefix: "request",
  ttl: 60 * 15, // 15 minutes
});
```

## Next Steps

- Study security patterns in [10_ADVANCED_SECURITY.md](./10_ADVANCED_SECURITY.md)
- Review testing strategies in [08_ADVANCED_TESTING.md](./08_ADVANCED_TESTING.md)
- Explore TypeScript patterns in [07_ADVANCED_TYPESCRIPT.md](./07_ADVANCED_TYPESCRIPT.md)
