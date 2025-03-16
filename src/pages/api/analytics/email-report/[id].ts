import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService } from '@/lib/services/analyticsService';

// This would be replaced with a real email sending service in production
const mockSendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  console.log(`Sending email to ${to} with subject: ${subject}`);
  console.log('Email content:', html);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success (in a real implementation, this would check if the email was sent successfully)
  return true;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: `The HTTP ${req.method} method is not supported for this route.`
    });
  }
  
  const { id } = req.query;
  const { email } = req.body;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid listing ID',
      message: 'Please provide a valid listing ID'
    });
  }
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid email address',
      message: 'Please provide a valid email address'
    });
  }
  
  try {
    // Generate the email report
    const reportHtml = analyticsService.generateEmailReport(id);
    
    // Send the email
    const emailSent = await mockSendEmail(
      email,
      `Analytics Report for Listing ${id}`,
      reportHtml
    );
    
    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: `Email report sent to ${email}`
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        message: 'The email service failed to send the report'
      });
    }
  } catch (error) {
    console.error('Email report error:', error);
    return res.status(500).json({
      success: false,
      error: 'Email report generation failed',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
} 