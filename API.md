# SmartPalms API Documentation

## External Access Endpoints

### OTP Access

Access a locker using a one-time password (OTP).

**GET** `/api/[otp]`

#### Parameters

- `otp` (path parameter): The one-time password for the locker

#### Response

```json
{
  "success": true,
  "locker": {
    "id": "string",
    "number": "string"
  }
}
```

#### Error Responses

- `400 Bad Request`
  ```json
  {
    "success": false,
    "message": "OTP is required",
    "code": "OTP_REQUIRED"
  }
  ```
- `404 Not Found`
  ```json
  {
    "success": false,
    "message": "Invalid or expired OTP",
    "code": "INVALID_OTP"
  }
  ```

### External Locker Access

Access a locker directly using its ID.

**POST** `/api/access/external`

#### Request Body

```json
{
  "locker_id": "string"
}
```

#### Response

```json
{
  "success": true,
  "locker": {
    "id": "string",
    "number": "string"
  }
}
```

#### Error Responses

- `400 Bad Request`
  ```json
  {
    "success": false,
    "message": "Locker ID is required",
    "code": "INVALID_REQUEST"
  }
  ```
- `404 Not Found`
  ```json
  {
    "success": false,
    "message": "Locker not found",
    "code": "LOCKER_NOT_FOUND"
  }
  ```

## Common Error Responses

All endpoints may return these common errors:

- `500 Internal Server Error`
  ```json
  {
    "success": false,
    "message": "Internal server error",
    "code": "INTERNAL_SERVER_ERROR"
  }
  ```

## Access History

Both endpoints automatically log access attempts with the following information:

- Success/failure status
- Access method (OTP or external)
- Locker ID
- Timestamp

## Security Notes

1. OTP access:

   - OTPs are single-use and expire after use
   - Invalid OTPs are logged for security monitoring
   - OTP expiration time is enforced

2. External access:
   - Requires valid locker ID
   - All access attempts are logged
   - Rate limiting is recommended for production use
