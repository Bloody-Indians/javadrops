import nodemailer from "nodemailer"

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
})

// Email templates
const emailTemplates = {
  projectSubmission: (data: any) => ({
    subject: `New Project Submission: ${data.title}`,
    html: `
      <h1>New Project Submission</h1>
      <p>A new project has been submitted:</p>
      <ul>
        <li><strong>Title:</strong> ${data.title}</li>
        <li><strong>Student:</strong> ${data.studentName}</li>
        <li><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</li>
      </ul>
      <p>Please log in to the admin portal to review this submission.</p>
    `,
  }),
  paymentConfirmation: (data: any) => ({
    subject: `Payment Confirmation: ${data.title}`,
    html: `
      <h1>Payment Confirmation</h1>
      <p>Your payment for the following project has been received:</p>
      <ul>
        <li><strong>Project:</strong> ${data.title}</li>
        <li><strong>Amount:</strong> $${data.amount.toFixed(2)}</li>
        <li><strong>Transaction ID:</strong> ${data.transactionId}</li>
      </ul>
      <p>Thank you for using JavaDrops!</p>
    `,
  }),
  projectAssigned: (data: any) => ({
    subject: `Project Assigned: ${data.title}`,
    html: `
      <h1>Project Assignment Notification</h1>
      <p>A project has been assigned to an agent:</p>
      <ul>
        <li><strong>Project:</strong> ${data.title}</li>
        <li><strong>Agent:</strong> ${data.agentName}</li>
        <li><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</li>
      </ul>
      <p>The agent will begin working on this project immediately.</p>
    `,
  }),
  projectCompleted: (data: any) => ({
    subject: `Project Completed: ${data.title}`,
    html: `
      <h1>Project Completion Notification</h1>
      <p>A project has been marked as completed:</p>
      <ul>
        <li><strong>Project:</strong> ${data.title}</li>
        <li><strong>Student:</strong> ${data.studentName}</li>
        <li><strong>Agent:</strong> ${data.agentName}</li>
      </ul>
      <p>Please log in to review the deliverables.</p>
    `,
  }),
  marketplacePurchase: (data: any) => ({
    subject: `Marketplace Purchase: ${data.productName}`,
    html: `
      <h1>Marketplace Purchase Confirmation</h1>
      <p>A purchase has been made in the marketplace:</p>
      <ul>
        <li><strong>Product:</strong> ${data.productName}</li>
        <li><strong>Price:</strong> $${data.price.toFixed(2)}</li>
        <li><strong>Buyer:</strong> ${data.buyerName}</li>
        <li><strong>Seller:</strong> ${data.sellerName}</li>
      </ul>
      <p>Thank you for using the JavaDrops Marketplace!</p>
    `,
  }),
}

/**
 * Send an email notification
 */
export async function sendEmail({
  to,
  cc,
  template,
  data,
}: {
  to: string | string[]
  cc?: string | string[]
  template: keyof typeof emailTemplates
  data: any
}) {
  try {
    const { subject, html } = emailTemplates[template](data)

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@javadrops.co.in",
      to,
      cc,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
