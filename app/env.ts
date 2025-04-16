export const env = {
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || "",

  // Authentication
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || "",
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || "",
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID || "",
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET || "",

  // PayPal
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",

  // Email
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "587",
  SMTP_SECURE: process.env.SMTP_SECURE || "false",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@javadrops.co.in",
}
