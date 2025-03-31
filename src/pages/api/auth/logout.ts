import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    // Clear the session cookie by setting an expired date
    res.setHeader('Set-Cookie', serialize('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set expiry to the past
      sameSite: 'strict',
      path: '/',
    }))

    return res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
} 