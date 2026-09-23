const nodemailer = require("nodemailer");

/* =========================================================
   CREATE MAIL TRANSPORTER
========================================================= */

function getTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email service is not configured.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: String(SMTP_PORT) === "587",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/* =========================================================
   PARTNER APPROVAL EMAIL
========================================================= */

async function sendPartnerApprovalEmail({
  email,
  companyName,
  contactPerson,
  temporaryPassword,
}) {
  const transporter = getTransporter();

  const loginUrl =
    process.env.PARTNER_LOGIN_URL ||
    "http://localhost:5173/partner-login";

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      `RAGAS Career World <${process.env.SMTP_USER}>`,

    to: email,

    subject:
      "RAGAS Career World – Partner Profile Verified",

    text: `
Hello ${contactPerson},

Your partner profile for ${companyName} has been verified by RAGAS Career World.

You can now log in to your Partner Dashboard using the credentials below:

Login Email: ${email}
Temporary Password: ${temporaryPassword}

Login:
${loginUrl}

Please change your password after your first login.

Regards,
RAGAS Career World
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">

        <h2>RAGAS Career World</h2>

        <p>Hello ${contactPerson},</p>

        <p>
          Your partner profile for
          <strong>${companyName}</strong>
          has been verified by RAGAS Career World.
        </p>

        <p>
          You can now access your Partner Dashboard using the credentials below:
        </p>

        <div
          style="
            background: #f5f7f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          "
        >
          <p>
            <strong>Login Email:</strong><br />
            ${email}
          </p>

          <p>
            <strong>Temporary Password:</strong><br />
            ${temporaryPassword}
          </p>
        </div>

        <p>
          <a
            href="${loginUrl}"
            style="
              display: inline-block;
              background: #0d3029;
              color: #ffffff;
              padding: 12px 22px;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Login to Partner Dashboard
          </a>
        </p>

        <p>
          <strong>Important:</strong>
          Please change your password after your first login.
        </p>

        <p>
          Regards,<br />
          <strong>RAGAS Career World</strong>
        </p>

      </div>
    `,
  });
}

/* =========================================================
   USER PASSWORD RESET OTP
========================================================= */

async function sendPasswordResetOtp({
  email,
  fullName,
  otp,
}) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to: email,

    subject:
      "RAGAS Career World password reset OTP",

    text: `
Hello ${fullName},

Your password reset OTP is ${otp}.

This OTP expires in 10 minutes.

Do not share this OTP with anyone.

Regards,
RAGAS Career World
`,

    html: `
      <p>Hello ${fullName},</p>

      <p>Your password reset OTP is:</p>

      <h2 style="letter-spacing: 4px;">
        ${otp}
      </h2>

      <p>
        This OTP expires in 10 minutes.
        Do not share it with anyone.
      </p>
    `,
  });
}

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  sendPasswordResetOtp,
  sendPartnerApprovalEmail,
};