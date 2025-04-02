# SmartPalms - Locker Management System

SmartPalms is a modern, responsive web application for managing smart lockers, built with SvelteKit, Flowbite-Svelte, TailwindCSS, and SQLite. The system enables users to rent lockers, generate access codes, and provides administrators with comprehensive management tools.

![SmartPalms Dashboard](https://via.placeholder.com/800x400?text=SmartPalms+Dashboard)

## 🚀 Features

### User Features

- **Authentication**: Secure login, registration, and profile management
- **Locker Rental**: Browse available lockers and submit rental requests
- **OTP Generation**: Generate one-time passwords to access lockers
- **Subscription Management**: View and manage locker subscriptions
- **Request Tracking**: Track rental request status
- **Access History**: View complete locker access history

### Admin Features

- **Dashboard**: Real-time statistics and overview of the system
- **User Management**: View and manage user accounts
- **Locker Management**: Add, view, and manage lockers
- **Request Processing**: Approve or reject rental requests with feedback
- **Subscription Management**: Create and manage subscription plans
- **Transaction Tracking**: Monitor all financial transactions

### API Endpoints

- External locker access via OTP
- Direct locker access for integrated systems
- Complete [API Documentation](API.md)

## 🛠️ Tech Stack

- **Frontend**:
  - SvelteKit 5.0
  - Flowbite-Svelte for UI components
  - TailwindCSS for styling
- **Backend**:
  - SvelteKit server-side rendering
  - SQLite with Drizzle ORM
  - Zod for validation
- **Authentication**:
  - Session-based authentication
  - bcrypt for password hashing

## 📋 Database Schema

The system uses a SQLite database with the following tables:

- Users: Store user information and authentication details
- Lockers: Manage locker information (size, status, etc.)
- Locker Requests: Track rental requests workflow
- Subscriptions: Manage active locker rentals
- Subscription Types: Define rental plans and pricing
- Transactions: Track financial transactions
- Access History: Log all locker access attempts

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/smartpalms.git
cd smartpalms
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following content:

```
DATABASE_URL="file:./data.db"
AUTH_SECRET="your-secret-key"
```

4. Initialize the database

```bash
npm run db:push
```

5. Start the development server

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 Responsive Design

SmartPalms is fully responsive and works on all device sizes:

- Desktop computers
- Tablets
- Mobile phones

The interface automatically adapts to provide an optimal user experience regardless of screen size.

## 🔒 Security Features

- Secure password hashing using bcrypt
- Session-based authentication
- Input validation with Zod
- OTP expiration for locker access
- Access logging for audit purposes

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Run all tests
npm run test
```

## 🙏 Acknowledgements

- [SvelteKit](https://kit.svelte.dev/)
- [Flowbite-Svelte](https://flowbite-svelte.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)

## Cron Jobs

SmartPalms uses Vercel Cron Jobs to perform scheduled tasks:

### Subscription Expiration Notifications

SmartPalms runs two daily cron jobs to check for subscriptions that expire on the current day and send email notifications to affected users:

1. **Primary check**: Runs at midnight (00:00)
2. **Secondary check**: Runs at noon (12:00) as backup

This dual-check system ensures users receive notifications even if one of the jobs fails to execute properly.

Configuration:

- Both jobs are defined in `vercel.json` with schedules of `0 0 * * *` and `0 12 * * *`
- The jobs call the `/api/cron/check-expiring-subscriptions` endpoint
- Authentication is handled automatically by Vercel's cron job system

To test this functionality locally:

1. Visit `/api/test/check-expiring-subscriptions` to see subscriptions expiring today (no emails are sent)
2. Check your email configuration with `/test-email`

For more information on Vercel Cron Jobs, see the [Vercel documentation](https://vercel.com/docs/cron-jobs).
