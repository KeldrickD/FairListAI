import { NextApiRequest } from 'next'
import { GetServerSidePropsContext } from 'next'

interface User {
  id: number
  email: string
  name: string
  role: string
}

/**
 * Parse the session cookie and extract user information
 */
export function getUserFromRequest(req: NextApiRequest | GetServerSidePropsContext['req']): User | null {
  try {
    const sessionCookie = req.cookies.session

    if (!sessionCookie) {
      return null
    }

    // In a real app, you would verify the JWT or other token method
    // Here we're just decoding the base64 string
    const decodedSession = Buffer.from(sessionCookie, 'base64').toString()
    const [userId, timestamp, role] = decodedSession.split(':')

    // Mock user database lookup
    // In a real app, you would query your database here
    const users = [
      { id: 1, email: 'agent@example.com', name: 'John Smith', role: 'agent' },
      { id: 2, email: 'admin@example.com', name: 'Admin User', role: 'admin' }
    ]
    
    const user = users.find(u => u.id === parseInt(userId))
    
    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error parsing session:', error)
    return null
  }
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(req: NextApiRequest | GetServerSidePropsContext['req']): boolean {
  return getUserFromRequest(req) !== null
}

/**
 * Get user role if authenticated
 */
export function getUserRole(req: NextApiRequest | GetServerSidePropsContext['req']): string | null {
  const user = getUserFromRequest(req)
  return user ? user.role : null
}

/**
 * Check if the user has a specific role
 */
export function hasRole(req: NextApiRequest | GetServerSidePropsContext['req'], role: string): boolean {
  const userRole = getUserRole(req)
  return userRole === role
}

/**
 * Server-side check to redirect unauthenticated users
 */
export function requireAuth(context: GetServerSidePropsContext, redirectTo = '/login') {
  if (!isAuthenticated(context.req)) {
    return {
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    }
  }
  
  return { props: {} }
}

/**
 * Server-side check to redirect authenticated users
 */
export function requireGuest(context: GetServerSidePropsContext, redirectTo = '/dashboard') {
  if (isAuthenticated(context.req)) {
    return {
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    }
  }
  
  return { props: {} }
} 