import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {setupMailer} from "$lib/services/EmailService";
import nodemailer from "nodemailer";
import {env} from "$env/dynamic/private";

export const GET: RequestHandler = async () => {
  await setupMailer();

  try {
    // Create a transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.MAILUSER,
        pass: env.MAILPASSWORD,
      },
    });

    // Send test email
    const info = await transporter.sendMail({
      from: env.MAIL_FROM || "noreply@smartpalms.com",
      to: env.MAILUSER, // Send to the same email
      subject: "SmartPalms Email Test",
      text: "This is a test email from SmartPalms application.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8971d; padding: 20px; text-align: center; color: black;">
            <h1>Email Test</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p>This is a test email from the SmartPalms application.</p>
            <p>If you received this email, your email configuration is working correctly!</p>
          </div>
        </div>
      `,
    });

    return json({
      success: true,
      messageId: info.messageId,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      {status: 500}
    );
  }
};
