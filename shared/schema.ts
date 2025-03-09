import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default('free'),
  isPremium: boolean("is_premium").notNull().default(false),
  listingsThisMonth: integer("listings_this_month").notNull().default(0),
  listingCredits: integer("listing_credits").notNull().default(0),
  seoEnabled: boolean("seo_enabled").notNull().default(false),
  socialMediaEnabled: boolean("social_media_enabled").notNull().default(false),
  videoScriptsEnabled: boolean("video_scripts_enabled").notNull().default(false),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  features: text("features").notNull(),
  tone: text("tone").notNull(),
  generatedListing: text("generated_listing"),
  seoOptimized: text("seo_optimized"),
  socialMediaContent: text("social_media_content"),
  videoScript: text("video_script"),
  generatedAt: timestamp("generated_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertListingSchema = createInsertSchema(listings)
  .pick({
    title: true,
    propertyType: true,
    bedrooms: true,
    bathrooms: true,
    squareFeet: true,
    features: true,
    tone: true,
  })
  .extend({
    title: z.string().min(3).max(100),
    propertyType: z.enum(['house', 'condo', 'apartment', 'townhouse']),
    bedrooms: z.coerce.number().min(0).max(20),
    bathrooms: z.coerce.number().min(0).max(20),
    squareFeet: z.coerce.number().min(100).max(50000),
    features: z.string().min(10).max(5000),
    tone: z.enum(['luxury', 'cozy', 'modern', 'professional', 'family-friendly']),
  });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PAY_PER_USE: 'pay_per_use',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const;

export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: { listings: 3 },
  [SUBSCRIPTION_TIERS.BASIC]: { listings: 10 },
  [SUBSCRIPTION_TIERS.PRO]: { listings: 50 },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: { listings: Infinity }
} as const;

export const SUBSCRIPTION_PRICES = {
  [SUBSCRIPTION_TIERS.BASIC]: 2900, // $29.00
  [SUBSCRIPTION_TIERS.PRO]: 9900,   // $99.00
  [SUBSCRIPTION_TIERS.ENTERPRISE]: 49900 // $499.00
} as const;

export const ADD_ON_PRICES = {
  SEO_OPTIMIZATION: 1000,      // $10.00
  SOCIAL_MEDIA: 1500,         // $15.00
  VIDEO_SCRIPT: 2500,         // $25.00
  SINGLE_LISTING: 500,        // $5.00
  BULK_LISTING_20: 5000,      // $50.00
} as const;