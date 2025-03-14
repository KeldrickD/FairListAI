import { db } from '../index';
import { users, sessions } from './schema';
import { eq, and, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h'; // 24 hours
const SALT_ROUNDS = 10;

export interface UserData {
  id: number;
  email: string;
  username: string;
  name?: string;
  role: string;
  subscriptionTier: string;
  isPremium: boolean;
  listingsThisMonth?: number;
  listingCredits?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify a password against a hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT tokens for a user
 */
export const generateTokens = async (userId: number): Promise<AuthTokens> => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  // Create a session for refresh token
  const sessionToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now
  
  await db.insert(sessions).values({
    userId,
    token: sessionToken,
    expiresAt,
  });
  
  return { accessToken, refreshToken: sessionToken };
};

/**
 * Register a new user
 */
export const registerUser = async (
  email: string,
  username: string,
  password: string,
  name?: string
): Promise<UserData> => {
  const passwordHash = await hashPassword(password);
  
  const [newUser] = await db.insert(users).values({
    email,
    username,
    passwordHash,
    name,
    role: 'user',
    subscriptionTier: 'free',
    isPremium: false,
  }).returning({
    id: users.id,
    email: users.email,
    username: users.username,
    name: users.name,
    role: users.role,
    subscriptionTier: users.subscriptionTier,
    isPremium: users.isPremium,
    listingsThisMonth: users.listingsThisMonth,
    listingCredits: users.listingCredits,
  });
  
  return newUser;
};

/**
 * Login a user with email/username and password
 */
export const loginUser = async (
  emailOrUsername: string,
  password: string
): Promise<{ user: UserData; tokens: AuthTokens }> => {
  const user = await db.query.users.findFirst({
    where: or(
      eq(users.email, emailOrUsername),
      eq(users.username, emailOrUsername)
    ),
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  const tokens = await generateTokens(user.id);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      isPremium: user.isPremium,
      listingsThisMonth: user.listingsThisMonth,
      listingCredits: user.listingCredits,
    },
    tokens,
  };
};

/**
 * Verify a JWT token and return the user id
 */
export const verifyToken = (token: string): { userId: number } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, refreshToken),
  });
  
  if (!session || new Date() > session.expiresAt) {
    throw new Error('Invalid or expired refresh token');
  }
  
  // Generate a new access token
  const accessToken = jwt.sign({ userId: session.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  return { accessToken, refreshToken };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<UserData | null> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    isPremium: user.isPremium,
    listingsThisMonth: user.listingsThisMonth,
    listingCredits: user.listingCredits,
  };
};

/**
 * Logout a user by removing their session
 */
export const logoutUser = async (userId: number, token: string): Promise<boolean> => {
  await db.delete(sessions).where(
    and(
      eq(sessions.userId, userId),
      eq(sessions.token, token)
    )
  );
  
  return true;
}; 