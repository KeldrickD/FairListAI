import { pgTable, serial, text, varchar, boolean, integer, timestamp, uuid, json, unique } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free').notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  listingsThisMonth: integer('listings_this_month').default(0),
  listingCredits: integer('listing_credits').default(10),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Listings table
export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  propertyType: varchar('property_type', { length: 50 }).notNull(),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  squareFeet: integer('square_feet'),
  price: integer('price'),
  location: varchar('location', { length: 255 }),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  complianceScore: integer('compliance_score'),
  seoScore: integer('seo_score'),
  mediaUrls: json('media_urls').$type<string[]>(),
  features: json('features').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Compliance checks table
export const complianceChecks = pgTable('compliance_checks', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').references(() => listings.id, { onDelete: 'cascade' }).notNull(),
  score: integer('score').notNull(),
  isCompliant: boolean('is_compliant').notNull(),
  issues: json('issues').$type<{ type: string, severity: string, text: string, suggestion: string }[]>(),
  improvedText: text('improved_text'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// SEO analyses table
export const seoAnalyses = pgTable('seo_analyses', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').references(() => listings.id, { onDelete: 'cascade' }).notNull(),
  score: integer('score').notNull(),
  keywords: json('keywords').$type<string[]>(),
  suggestions: json('suggestions').$type<{ category: string, issue: string, suggestion: string }[]>(),
  improvedText: text('improved_text'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Sessions table for authentication
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 500 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// API rate limits for security
export const rateLimits = pgTable('rate_limits', {
  id: serial('id').primaryKey(),
  ip: varchar('ip', { length: 50 }).notNull(),
  endpoint: varchar('endpoint', { length: 255 }).notNull(), 
  count: integer('count').default(0).notNull(),
  resetAt: timestamp('reset_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    ipEndpointIdx: unique('ip_endpoint_idx').on(table.ip, table.endpoint),
  }
}); 