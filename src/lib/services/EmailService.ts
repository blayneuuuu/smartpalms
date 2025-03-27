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
      transporter = nodemailer.createTransport({
        host: env.MAILHOST,
        port: parseInt(env.MAILPORT),
        secure: parseInt(env.MAILPORT) === 465,
        auth: {
          user: env.MAILUSER,
          pass: env.MAILPASSWORD,
        },
      });
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
    subject: "Verify your SmartPalms account",
    text: `Hello ${name},\n\nPlease verify your email address by clicking on the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nThank you,\nSmartPalms Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8971d; padding: 20px; text-align: center; color: black;">
          <h1>Email Verification</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>Thank you for registering with SmartPalms. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold;">Verify Email</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Thank you,<br>SmartPalms Team</p>
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
