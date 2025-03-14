import { db } from '../index';
import { listings } from './schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';

export interface ListingData {
  id?: number;
  userId: number;
  title: string;
  description: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  price?: number;
  location?: string;
  status?: string;
  complianceScore?: number;
  seoScore?: number;
  mediaUrls?: string[];
  features?: string[];
}

export interface ListingFilter {
  userId?: number;
  propertyType?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Create a new listing
 */
export const createListing = async (data: ListingData) => {
  const [listing] = await db.insert(listings).values({
    userId: data.userId,
    title: data.title,
    description: data.description,
    propertyType: data.propertyType,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    squareFeet: data.squareFeet,
    price: data.price,
    location: data.location,
    status: data.status || 'draft',
    complianceScore: data.complianceScore,
    seoScore: data.seoScore,
    mediaUrls: data.mediaUrls ? JSON.stringify(data.mediaUrls) : null,
    features: data.features ? JSON.stringify(data.features) : null,
  }).returning();

  return listing;
};

/**
 * Get a listing by ID
 */
export const getListingById = async (id: number) => {
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, id),
  });
  
  return listing;
};

/**
 * Get listings with filters
 */
export const getListings = async (filter: ListingFilter = {}) => {
  let query = db.select().from(listings);
  
  // Apply filters
  if (filter.userId) {
    query = query.where(eq(listings.userId, filter.userId));
  }
  
  if (filter.propertyType) {
    query = query.where(eq(listings.propertyType, filter.propertyType));
  }
  
  if (filter.minBedrooms) {
    query = query.where(sql`${listings.bedrooms} >= ${filter.minBedrooms}`);
  }
  
  if (filter.maxBedrooms) {
    query = query.where(sql`${listings.bedrooms} <= ${filter.maxBedrooms}`);
  }
  
  if (filter.minBathrooms) {
    query = query.where(sql`${listings.bathrooms} >= ${filter.minBathrooms}`);
  }
  
  if (filter.maxBathrooms) {
    query = query.where(sql`${listings.bathrooms} <= ${filter.maxBathrooms}`);
  }
  
  if (filter.minPrice) {
    query = query.where(sql`${listings.price} >= ${filter.minPrice}`);
  }
  
  if (filter.maxPrice) {
    query = query.where(sql`${listings.price} <= ${filter.maxPrice}`);
  }
  
  if (filter.location) {
    query = query.where(sql`${listings.location} ILIKE ${`%${filter.location}%`}`);
  }
  
  if (filter.status) {
    query = query.where(eq(listings.status, filter.status));
  }
  
  // Apply sorting
  if (filter.sortBy) {
    const column = listings[filter.sortBy as keyof typeof listings];
    if (column) {
      query = query.orderBy(filter.sortOrder === 'desc' ? desc(column) : asc(column));
    }
  } else {
    // Default sort by creation date, newest first
    query = query.orderBy(desc(listings.createdAt));
  }
  
  // Apply pagination
  const page = filter.page || 1;
  const limit = filter.limit || 10;
  const offset = (page - 1) * limit;
  
  query = query.limit(limit).offset(offset);
  
  const results = await query;
  
  // Get total count for pagination
  const countQuery = db.select({ count: sql`count(*)` }).from(listings);
  const [{ count }] = await countQuery;
  
  return {
    listings: results,
    pagination: {
      total: Number(count),
      page,
      limit,
      pages: Math.ceil(Number(count) / limit)
    }
  };
};

/**
 * Update a listing
 */
export const updateListing = async (id: number, userId: number, data: Partial<ListingData>) => {
  const [updatedListing] = await db.update(listings)
    .set({
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      squareFeet: data.squareFeet,
      price: data.price,
      location: data.location,
      status: data.status,
      complianceScore: data.complianceScore,
      seoScore: data.seoScore,
      mediaUrls: data.mediaUrls ? JSON.stringify(data.mediaUrls) : undefined,
      features: data.features ? JSON.stringify(data.features) : undefined,
      updatedAt: new Date(),
    })
    .where(and(
      eq(listings.id, id),
      eq(listings.userId, userId) // Ensure the user owns the listing
    ))
    .returning();
  
  return updatedListing;
};

/**
 * Delete a listing
 */
export const deleteListing = async (id: number, userId: number) => {
  await db.delete(listings).where(
    and(
      eq(listings.id, id),
      eq(listings.userId, userId) // Ensure the user owns the listing
    )
  );
  
  return true;
}; 