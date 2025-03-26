# SmartPalms API Endpoints

This document provides a comprehensive list of all API endpoints in the SmartPalms system, organized by their purpose and functionality.

## Access Endpoints

### Direct Hardware Access

- **POST** `/api/access/direct`

  - Purpose: Used by hardware devices to directly access lockers without user authentication
  - Request Body: `{ locker_id: string }`
  - Response: `{ success: boolean, locker: { id: string, number: string } }`
  - Notes: Logs all access attempts for auditing
  - Security: Should be protected with IP restrictions in production

- **POST** `/api/access/external` _(Deprecated)_
  - Purpose: Redirects to `/api/access/direct`
  - Notes: Kept for backward compatibility

### Authenticated User Access

- **POST** `/api/access/authenticated`

  - Purpose: Authenticates users and returns their locker access information
  - Request Body: `{ email: string, password: string }`
  - Response: `{ success: boolean, user: UserData, lockers: EnhancedLockerData[] }`
  - Notes: Enhanced with locker expiration information
  - Used by: Third-party applications or client apps

- **POST** `/api/lockers/external` _(Deprecated)_
  - Purpose: Redirects to `/api/access/authenticated`
  - Notes: Kept for backward compatibility

### OTP Access

- **GET** `/api/[otp]`
  - Purpose: Access a locker using a one-time password
  - Path Parameter: `otp` - The one-time password for the locker
  - Response: `{ success: boolean, locker: { id: string, number: string } }`
  - Notes: OTPs are single-use and expire after use

## Locker Management

### Public Endpoints

- **GET** `/api/lockers`

  - Purpose: Get all lockers with availability status
  - Response: `{ success: boolean, lockers: LockerData[] }`
  - Notes: Public endpoint available to all users

- **GET** `/api/lockers/[id]`

  - Purpose: Get a specific locker by ID
  - Path Parameter: `id` - The locker ID
  - Response: `{ locker: LockerData }`

- **POST** `/api/lockers/[id]/otp`
  - Purpose: Generate a one-time password for a locker
  - Path Parameter: `id` - The locker ID
  - Response: `{ otp: string, expiryDate: string }`
  - Notes: Requires authentication

### User-Specific Endpoints

- **GET** `/api/lockers/user/[id]`

  - Purpose: Get a user's active subscriptions and requests
  - Path Parameter: `id` - The user ID
  - Response: `{ success: boolean, subscriptions: Array, requests: Array, subscriptionsCount: number, requestsCount: number }`
  - Notes: Enhanced with days until expiration and expiring soon status

- **GET** `/api/lockers/user/[id]/access-history`
  - Purpose: Get a user's locker access history
  - Path Parameter: `id` - The user ID
  - Response: `{ history: AccessHistory[] }`

### Request Management

- **POST** `/api/lockers/request`

  - Purpose: Submit a request to rent a locker
  - Request Body: `{ lockerId: string, subscriptionTypeId: string, proofOfPayment: string }`
  - Response: `{ success: boolean, request: Object }`

- **POST** `/api/lockers/request/[id]/resubmit`
  - Purpose: Resubmit a rejected request
  - Path Parameter: `id` - The request ID
  - Response: `{ success: boolean }`

## Authentication

- **POST** `/api/auth/signout`
  - Purpose: Sign out the current user
  - Response: `{ success: boolean }`

## Subscription Types

- **GET** `/api/subscription-types`
  - Purpose: Get all active subscription types
  - Response: `{ success: boolean, subscriptionTypes: SubscriptionTypeData[] }`
  - Notes: Cached for 5 minutes

## Transactions

- **GET** `/api/transaction`
  - Purpose: Get transaction data
  - Response: Transaction data

## Admin Endpoints

### Admin Statistics

- **GET** `/api/admin/stats`
  - Purpose: Get dashboard statistics for admin
  - Response: `{ totalLockers: number, occupiedLockers: number, totalUsers: number, pendingRequests: number }`
  - Notes: Requires admin authentication

### Admin Locker Management

- **GET** `/api/admin/lockers`

  - Purpose: Get all lockers with detailed information
  - Response: `{ lockers: Array }`
  - Notes: Includes user information for assigned lockers

- **POST** `/api/admin/lockers`

  - Purpose: Create a new locker
  - Request Body: `{ number: string, size: string }`
  - Response: `{ success: boolean }`

- **PATCH** `/api/admin/lockers/[id]`
  - Purpose: Update a locker (e.g., assign to user)
  - Path Parameter: `id` - The locker ID
  - Request Body: `{ userId: string | null }`
  - Response: `{ success: boolean, locker: Object }`

### Admin User Management

- **GET** `/api/admin/users`

  - Purpose: Get all users
  - Response: `{ users: Array }`

- **GET** `/api/admin/users/[id]`
  - Purpose: Get a specific user's details
  - Path Parameter: `id` - The user ID
  - Response: User data

### Admin Request Management

- **GET** `/api/admin/requests`

  - Purpose: Get all locker requests
  - Response: `{ requests: Array }`

- **PATCH** `/api/admin/requests/[id]`
  - Purpose: Process a request (approve/reject)
  - Path Parameter: `id` - The request ID
  - Request Body: `{ status: "approve" | "reject", rejectionReason?: string }`
  - Response: `{ success: boolean }`

### Admin Subscription Management

- **GET** `/api/admin/subscriptions`
  - Purpose: Get all subscriptions
  - Response: Subscription data

### Admin Subscription Types Management

- **GET** `/api/admin/subscription-types`

  - Purpose: Get all subscription types (active and inactive)
  - Response: `{ subscriptionTypes: Array }`

- **POST** `/api/admin/subscription-types`

  - Purpose: Create a new subscription type
  - Request Body: `{ name: string, duration: string, amount: number }`
  - Response: `{ subscriptionType: Object }`

- **PATCH** `/api/admin/subscription-types/[id]`
  - Purpose: Update a subscription type
  - Path Parameter: `id` - The subscription type ID
  - Request Body: Update data
  - Response: Updated subscription type

## Response Format Standard

All API endpoints follow a standardized response format:

```typescript
{
  success: boolean;       // Whether the request was successful
  message?: string;       // Optional success/error message
  error?: string;         // Optional error details
  [data field]: any;      // The actual response data with appropriate field name
}
```

## Error Handling

All endpoints use consistent error handling that provides:

1. Appropriate HTTP status codes
2. Error messages
3. Error codes where applicable

## Authentication and Authorization

Most endpoints require authentication via session cookies established at login.
Admin endpoints additionally verify the user has the "admin" role.

## API Versioning

The current implementation does not use explicit versioning in the URL path.
Backward compatibility is maintained through redirection for deprecated endpoints.
