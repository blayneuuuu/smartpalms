# SmartPalms API Documentation

## Authentication Endpoints

### Sign In

**POST** `/api/auth/signin`  
Signs in a user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "type": "user"
  }
}
```

### Sign Out

**POST** `/api/auth/signout`  
Signs out the current user.

**Response:**

```json
{
  "success": true
}
```

## Access Endpoints

### Direct Access

**POST** `/api/access/direct`  
Allows hardware devices direct access to lockers without user authentication.

**Request Body:**

```json
{
  "locker_id": "locker-id"
}
```

**Response:**

```json
{
  "success": true,
  "locker": {
    "id": "locker-id",
    "number": "101"
  }
}
```

### Authenticated Access

**POST** `/api/access/authenticated`  
Authenticates users and returns their locker access information.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "lockers": [
    {
      "id": "locker-id",
      "number": "101",
      "size": "small",
      "subscription": {
        "id": "subscription-id",
        "status": "active",
        "expiresAt": "2023-12-31"
      }
    }
  ]
}
```

### OTP Access

**GET** `/api/[otp]`  
Validates and uses a one-time password (OTP) to access a locker.

**Response:**

```json
{
  "success": true,
  "locker": {
    "id": "locker-id",
    "number": "101"
  }
}
```

## Locker Endpoints

### List All Lockers

**GET** `/api/lockers`  
Returns a list of all lockers.

**Response:**

```json
{
  "success": true,
  "lockers": [
    {
      "id": "locker-id",
      "number": "101",
      "size": "small",
      "isOccupied": false
    }
  ]
}
```

### Get User Lockers

**GET** `/api/lockers/user/:userId`  
Returns lockers associated with a specific user.

**Response:**

```json
{
  "subscriptionsCount": 1,
  "requestsCount": 0,
  "subscriptions": [
    {
      "id": "subscription-id",
      "lockerId": "locker-id",
      "lockerNumber": "101",
      "lockerSize": "small",
      "expiresAt": "2023-12-31",
      "status": "active"
    }
  ],
  "requests": []
}
```

### Generate OTP

**POST** `/api/lockers/:lockerId/otp`  
Generates a one-time password for locker access.

**Response:**

```json
{
  "otp": "123456",
  "expiryDate": "2023-10-10T12:00:00Z"
}
```

### Submit Locker Request

**POST** `/api/lockers/request`  
Submits a request to rent a locker.

**Request Body:**

```json
{
  "lockerId": "locker-id",
  "subscriptionTypeId": "subscription-type-id",
  "proofOfPayment": "base64-encoded-image"
}
```

**Response:**

```json
{
  "success": true,
  "requestId": "request-id"
}
```

## Subscription Types Endpoints

### List Subscription Types

**GET** `/api/subscription-types`  
Returns a list of active subscription types.

**Response:**

```json
{
  "success": true,
  "subscriptionTypes": [
    {
      "id": "subscription-type-id",
      "name": "Monthly Plan",
      "duration": "30_days",
      "amount": 5000
    }
  ]
}
```

## Admin Endpoints

### Dashboard Stats

**GET** `/api/admin/stats`  
Returns dashboard statistics for administrators.

**Response:**

```json
{
  "totalLockers": 10,
  "occupiedLockers": 5,
  "totalUsers": 20,
  "pendingRequests": 3
}
```

### Admin Subscription Types

**GET** `/api/admin/subscription-types`  
Returns all subscription types for administrators.

**Response:**

```json
{
  "subscriptionTypes": [
    {
      "id": "subscription-type-id",
      "name": "Monthly Plan",
      "duration": "30_days",
      "amount": 5000,
      "isActive": true
    }
  ]
}
```

**POST** `/api/admin/subscription-types`  
Creates a new subscription type.

**Request Body:**

```json
{
  "name": "Weekly Plan",
  "duration": "7_days",
  "amount": 2000
}
```

**Response:**

```json
{
  "subscriptionType": {
    "id": "new-subscription-type-id",
    "name": "Weekly Plan",
    "duration": "7_days",
    "amount": 2000,
    "isActive": true
  }
}
```

## Deprecated Endpoints

The following endpoints are deprecated and will be removed in a future release. They currently redirect to their replacements.

- **POST** `/api/access/external` → `/api/access/direct`
- **POST** `/api/lockers/external` → `/api/access/authenticated`
