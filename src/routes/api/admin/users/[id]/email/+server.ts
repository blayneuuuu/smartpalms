import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {directClient} from "$lib/db/direct-client";
import nodemailer from "nodemailer";
import {env} from "$env/dynamic/private";
import {dev} from "$app/environment";
import {setupMailer} from "$lib/services/EmailService";

// Create a generic function to send emails
async function sendGenericEmail(
  email: string,
  subject: string,
  content: string,
  name: string
) {
  await setupMailer();

  // Create test account during development if needed
  let testAccount: nodemailer.TestAccount | null = null;
  let transporter: nodemailer.Transporter | null = null;

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
      if (env.MAILHOST === "smtp.gmail.com") {
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: env.MAILUSER,
            pass: env.MAILPASSWORD,
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
    }

    const fromAddress =
      env.MAIL_FROM ||
      (dev && testAccount ? testAccount.user : "noreply@smartpalms.com");

    const mailOptions = {
      from: fromAddress,
      to: email,
      subject: subject,
      text: `Hello ${name},\n\n${content}\n\nThank you,\nSMARTPALMS Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8971d; padding: 20px; text-align: center; color: black;">
            <h1>${subject}</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p>Hello ${name},</p>
            ${content
              .split("\n")
              .map((line) => `<p>${line}</p>`)
              .join("")}
            <p>Thank you,<br>SMARTPALMS Team</p>
          </div>
        </div>
      `,
    };

    // If transporter is available, send email
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);

      if (dev && testAccount) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }

      return {success: true, info};
    } else {
      // Log email details for debugging
      console.log(`Email sending skipped. Details:`);
      console.log(`Subject: ${subject}`);
      console.log(`Recipient: ${email}`);

      return {success: true, simulated: true};
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export const POST: RequestHandler = async ({request, params, locals}) => {
  // Check if user is admin
  if (!locals.user || locals.user.type !== "admin") {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  const userId = params.id;
  if (!userId) {
    return json({success: false, message: "Missing user ID"}, {status: 400});
  }

  try {
    // Get request body
    const body = await request.json();
    const {subject, content} = body;

    if (!subject || !content) {
      return json(
        {
          success: false,
          message: "Subject and content are required",
        },
        {status: 400}
      );
    }

    // Get user email
    const userResult = await directClient.execute({
      sql: "SELECT email, name FROM users WHERE id = ?",
      args: [userId],
    });

    if (userResult.rows.length === 0) {
      return json({success: false, message: "User not found"}, {status: 404});
    }

    const userEmail = userResult.rows[0].email as string;
    const userName = userResult.rows[0].name as string;

    // Send email
    await sendGenericEmail(userEmail, subject, content, userName);

    // Log that an email was sent
    console.log(
      `[EMAIL] Admin sent email to user ${userId} (${userEmail}): ${subject}`
    );

    return json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("[API] Error sending email:", error);
    return json(
      {success: false, message: "An error occurred while sending email"},
      {status: 500}
    );
  }
};
