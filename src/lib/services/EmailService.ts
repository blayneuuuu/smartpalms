import nodemailer from "nodemailer";
import {env} from "$env/dynamic/private";
import {dev} from "$app/environment";

// Create test account during development
let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;
let setupComplete = false;

export async function setupMailer() {
  if (setupComplete) return;

  try {
    if (dev) {
      // Use ethereal.email for testing
      testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else if (
      env.MAILHOST &&
      env.MAILPORT &&
      env.MAILUSER &&
      env.MAILPASSWORD
    ) {
      // Use configured mail provider for production
      // Special configuration for Gmail
      if (env.MAILHOST === "smtp.gmail.com") {
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: env.MAILUSER,
            pass: env.MAILPASSWORD, // App password for Gmail
          },
        });
      } else {
        transporter = nodemailer.createTransport({
          host: env.MAILHOST,
          port: parseInt(env.MAILPORT),
          secure: parseInt(env.MAILPORT) === 465,
          auth: {
            user: env.MAILUSER,
            pass: env.MAILPASSWORD,
          },
        });
      }
    } else {
      console.log(
        "Email credentials not properly configured. Email sending will be skipped."
      );
    }
    setupComplete = true;
  } catch (error) {
    console.error("Error setting up email transporter:", error);
    setupComplete = true; // Mark as complete even if failed to avoid repeated attempts
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  await setupMailer();

  const verificationLink = `${env.BASE_URL || "https://smartpalms.vercel.app"}/verify-email?token=${token}`;

  const mailOptions = {
    from:
      env.MAIL_FROM ||
      (dev && testAccount ? testAccount.user : "noreply@smartpalms.com"),
    to: email,
    subject: "Verify your SMARTPALMS account",
    text: `Hello ${name},\n\nPlease verify your email address by clicking on the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nThank you,\nSMARTPALMS Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8971d; padding: 20px; text-align: center; color: black;">
          <h1>Email Verification</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>Thank you for registering with SMARTPALMS. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold;">Verify Email</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Thank you,<br>SMARTPALMS Team</p>
        </div>
      </div>
    `,
  };

  try {
    // If transporter is available, send email
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);

      if (dev && testAccount) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }

      return {success: true, info};
    } else {
      // Log verification details for debugging in production
      console.log("Email sending skipped. Verification details:");
      console.log(`Token: ${token}`);
      console.log(`Verification link: ${verificationLink}`);
      console.log(`Recipient: ${email}`);

      return {success: true, simulated: true};
    }
  } catch (error) {
    console.error("Error sending verification email:", error);

    // In production, don't fail the registration process if email sending fails
    if (!dev) {
      console.log("Continuing registration despite email failure");
      console.log(`Token: ${token}`);
      console.log(`Verification link: ${verificationLink}`);
      return {success: true, simulated: true, error};
    }

    throw error;
  }
}

/**
 * Send an email notification about a subscription that's about to expire
 */
export async function sendExpirationNotificationEmail(
  email: string,
  name: string,
  lockerNumber: string,
  expiresAt: string
) {
  await setupMailer();

  // Format the expiration date for display
  const expirationDate = new Date(expiresAt);
  const formattedDate = expirationDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = expirationDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renewLink = `${env.BASE_URL || "https://smartpalms.vercel.app"}/dashboard`;

  const mailOptions = {
    from:
      env.MAIL_FROM ||
      (dev && testAccount ? testAccount.user : "noreply@smartpalms.com"),
    to: email,
    subject: "Your SMARTPALMS Locker Subscription Expires Today",
    text: `Hello ${name},\n\nYour subscription for Locker #${lockerNumber} will expire today (${formattedDate} at ${formattedTime}).\n\nTo continue using your locker, please log in to your account and renew your subscription as soon as possible.\n\nThank you,\nSMARTPALMS Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8971d; padding: 20px; text-align: center; color: black;">
          <h1>Subscription Expiring Today</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>Your subscription for <strong>Locker #${lockerNumber}</strong> will expire today (${formattedDate} at ${formattedTime}).</p>
          <p>To continue using your locker, please renew your subscription as soon as possible.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${renewLink}" style="background-color: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold;">Renew Subscription</a>
          </div>
          <p>If you no longer need the locker, please ensure that you've removed all your belongings before the subscription expires.</p>
          <p>Thank you,<br>SMARTPALMS Team</p>
        </div>
      </div>
    `,
  };

  try {
    // If transporter is available, send email
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);

      if (dev && testAccount) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }

      return {success: true, info};
    } else {
      // Log details for debugging in production
      console.log("Email sending skipped. Expiration notification details:");
      console.log(`Recipient: ${email}`);
      console.log(`Locker: ${lockerNumber}`);
      console.log(`Expires: ${formattedDate} at ${formattedTime}`);

      return {success: true, simulated: true};
    }
  } catch (error) {
    console.error("Error sending expiration notification email:", error);

    // In production, don't fail if email sending fails
    if (!dev) {
      console.log("Continuing despite email failure");
      return {success: true, simulated: true, error};
    }

    throw error;
  }
}

/**
 * Send a password reset email with a token link
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
  resetLink: string
) {
  await setupMailer();

  const mailOptions = {
    from:
      env.MAIL_FROM ||
      (dev && testAccount ? testAccount.user : "noreply@smartpalms.com"),
    to: email,
    subject: "Reset Your SMARTPALMS Password",
    text: `Hello ${name},\n\nYou requested to reset your SMARTPALMS password. Please click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you did not request this reset, please ignore this email.\n\nThank you,\nSMARTPALMS Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8971d; padding: 20px; text-align: center; color: black;">
          <h1>Password Reset</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>You requested to reset your SMARTPALMS password. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this reset, please ignore this email.</p>
          <p>Thank you,<br>SMARTPALMS Team</p>
        </div>
      </div>
    `,
  };

  try {
    // If transporter is available, send email
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);

      if (dev && testAccount) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }

      return {success: true, info};
    } else {
      // Log details for debugging in production
      console.log("Email sending skipped. Password reset details:");
      console.log(`Recipient: ${email}`);
      console.log(`Reset Link: ${resetLink}`);

      return {success: true, simulated: true};
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);

    // In production, don't fail if email sending fails
    if (!dev) {
      console.log("Continuing despite email failure");
      return {success: true, simulated: true, error};
    }

    throw error;
  }
}
