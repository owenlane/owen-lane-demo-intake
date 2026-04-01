import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendBuildSubmissionEmail(data: {
  practiceName: string;
  doctorName: string;
  contactName: string;
  email: string;
  phone: string;
  buildType: string;
  notes: string;
}) {
  const subject = `New POI Build Submission — ${data.practiceName}`;

  const text = `
New build submission received.

Practice Name: ${data.practiceName}
Doctor Name: ${data.doctorName}
Contact Name: ${data.contactName}
Email: ${data.email}
Phone: ${data.phone}
Build Type: ${data.buildType}

Notes:
${data.notes}
  `.trim();

  await transporter.sendMail({
    from: `"LCG Build Intake" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: data.email,
    subject,
    text,
  });
}