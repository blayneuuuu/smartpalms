# SmartPalms New Features

## Password Reset Feature

We've implemented a complete password reset flow:

1. **Forgot Password Page**:

   - Users can request a password reset by entering their email address.
   - Located at `/forgot-password`
   - System sends a secure, time-limited reset link via email.

2. **Password Reset Page**:
   - Users can set a new password using the link from their email.
   - Located at `/reset-password?token=<reset_token>`
   - Token expires after 1 hour for security.
   - User must enter and confirm a new password (minimum 8 characters).
3. **Security**:
   - Reset tokens are stored securely in the database.
   - Response messages are carefully worded to avoid revealing whether an email exists in the system.
   - Password reset is only allowed for verified users.
   - Tokens become invalid after being used once.

## Enhanced Profile Management

The profile management page now features:

1. **Tabbed Interface**:

   - "Profile Settings" tab:
     - Edit name, email, and password
     - All original functionality preserved
   - "Subscription History" tab:
     - View recent subscription history (last 10 subscriptions)
     - Information includes locker number, size, status, and dates

2. **Subscription Details**:
   - Status indicators with appropriate colors:
     - Active: green
     - Expired: red
     - Cancelled: dark gray
   - Dates are properly formatted for readability
   - Locker information is displayed alongside subscription details

## Database Changes

The following changes were made to the database schema:

- Added `resetToken` column to `users` table
- Added `resetTokenExpiry` column to `users` table
- Created index on `resetToken` for faster lookups

## Running Migrations

To apply the new database schema changes, run the migrations:

```bash
npm run migrate
```

## Security Considerations

- Password reset tokens expire after 1 hour
- Reset tokens are invalidated after use
- Users are required to reauthenticate after password changes
- Password reset request responses are consistent regardless of whether the email exists
