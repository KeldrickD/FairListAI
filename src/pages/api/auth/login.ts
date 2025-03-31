import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

// Mock user database - in a real app this would be a database
const users = [
  { id: 1, email: 'agent@example.com', password: 'password123', name: 'John Smith', role: 'agent' },
  { id: 2, email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' }
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Find user by email
    const user = users.find(user => user.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Create user session/token
    // In a real app, you would use JWT or other token method
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}:${user.role}`).toString('base64')

    // Set HTTP-only cookie with the session token
    res.setHeader('Set-Cookie', serialize('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    }))

    // Return success response with user info (excluding password)
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
} 