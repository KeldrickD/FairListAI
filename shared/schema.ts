import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  listingsThisMonth: integer("listings_this_month").notNull().default(0),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  features: text("features").notNull(),
  generatedListing: text("generated_listing"),
  generatedAt: timestamp("generated_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertListingSchema = createInsertSchema(listings)
  .pick({
    propertyType: true,
    bedrooms: true,
    bathrooms: true,
    squareFeet: true,
    features: true,
  })
  .extend({
    propertyType: z.enum(['house', 'condo', 'apartment', 'townhouse']),
    bedrooms: z.coerce.number().min(0).max(20),
    bathrooms: z.coerce.number().min(0).max(20),
    squareFeet: z.coerce.number().min(100).max(50000),
    features: z.string().min(10).max(5000),
  });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;