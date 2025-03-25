// In a production app, you would use a real email service like SendGrid, Mailchimp, etc.
// For demo purposes, we'll simulate email sending

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

/**
 * Sends an email with the given options
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  console.log('Sending email to:', options.to);
  console.log('Subject:', options.subject);
  console.log('Body:', options.body);
  
  // Simulate sending email
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you would use an email service API
      resolve(true);
    }, 1000);
  });
}

/**
 * Sends a welcome email to a newly registered user
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const subject = 'Welcome to FairListAI!';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Welcome to FairListAI, ${name}!</h1>
      
      <p>Thank you for joining our platform. We're excited to help you create amazing property listings with the power of AI.</p>
      
      <h2 style="color: #4f46e5;">Getting Started</h2>
      <ol>
        <li>Visit your <a href="https://listinggenieai.com/dashboard" style="color: #4f46e5;">dashboard</a> to view your listings</li>
        <li>Create your first AI-powered listing by clicking on "Create New Listing"</li>
        <li>Explore our premium features to enhance your real estate marketing</li>
      </ol>
      
      <p>If you have any questions, please reply to this email or contact our support team.</p>
      
      <p>Best regards,<br>The FairListAI Team</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    body,
    isHtml: true,
  });
}

/**
 * Sends an email verification link to a newly registered user
 */
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verificationLink = `https://listinggenieai.com/verify-email?token=${token}`;
  const subject = 'Verify Your Email Address';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Verify Your Email Address</h1>
      
      <p>Thank you for signing up! Please click the button below to verify your email address:</p>
      
      <a href="${verificationLink}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Verify Email
      </a>
      
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p>${verificationLink}</p>
      
      <p>This link will expire in 24 hours.</p>
      
      <p>Best regards,<br>The FairListAI Team</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    body,
    isHtml: true,
  });
}

/**
 * Sends a confirmation email when a new listing is created
 */
export async function sendListingCreatedEmail(email: string, listingTitle: string): Promise<boolean> {
  const subject = 'Your New Listing Has Been Created';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Your Listing Has Been Created!</h1>
      
      <p>Great news! Your listing <strong>${listingTitle}</strong> has been successfully created and saved to your dashboard.</p>
      
      <p>You can view and edit your listing at any time by visiting your <a href="https://listinggenieai.com/dashboard" style="color: #4f46e5;">dashboard</a>.</p>
      
      <h2 style="color: #4f46e5;">Next Steps:</h2>
      <ul>
        <li>Share your listing on social media</li>
        <li>Download your listing as a PDF</li>
        <li>Create more listings to grow your portfolio</li>
      </ul>
      
      <p>Best regards,<br>The FairListAI Team</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    body,
    isHtml: true,
  });
} 