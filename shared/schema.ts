import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Subscription tier constants
export const SUBSCRIPTION_TIERS = {
  BASIC: "BASIC",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE",
  PAY_PER_USE: "PAY_PER_USE",
} as const;

// Pricing in cents
export const SUBSCRIPTION_PRICES = {
  basic: 1999, // $19.99
  pro: 4999,   // $49.99
  enterprise: 9999, // $99.99
} as const;

export const ADD_ON_PRICES = {
  SEO_OPTIMIZATION: 999,  // $9.99
  SOCIAL_MEDIA: 999,      // $9.99
  VIDEO_SCRIPT: 1999,     // $19.99
} as const;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default(SUBSCRIPTION_TIERS.BASIC),
  isPremium: boolean("is_premium").notNull().default(false),
  listingsThisMonth: integer("listings_this_month").notNull().default(0),
  listingCredits: integer("listing_credits").notNull().default(0),
  seoEnabled: boolean("seo_enabled").notNull().default(false),
  socialMediaEnabled: boolean("social_media_enabled").notNull().default(false),
  videoScriptsEnabled: boolean("video_scripts_enabled").notNull().default(false),
});

// Listings table
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  features: text("features").notNull(),
  tone: text("tone").notNull().default("professional"),
  generatedListing: text("generated_listing"),
  seoOptimized: text("seo_optimized"),
  socialMediaContent: text("social_media_content"),
  videoScript: text("video_script"),
  generatedAt: timestamp("generated_at"),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

export const selectUserSchema = createSelectSchema(users);

export const insertListingSchema = createInsertSchema(listings, {
  title: z.string().optional(),
  propertyType: z.string(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  squareFeet: z.number().int().min(1),
  features: z.string(),
  tone: z.string().optional(),
  location: z.string(),
  price: z.number().int().min(1),
}).omit({ id: true, userId: true, generatedListing: true, seoOptimized: true, socialMediaContent: true, videoScript: true, generatedAt: true })
  .extend({
    location: z.string(),
    price: z.number().int().min(1),
  });

export const selectListingSchema = createSelectSchema(listings);

// TypeScript types
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Listing = z.infer<typeof selectListingSchema>;
export type InsertListing = z.infer<typeof insertListingSchema>;