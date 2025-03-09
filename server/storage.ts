import { users, type User, type InsertUser, listings, type Listing, type InsertListing } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserListingCount(userId: number): Promise<void>;
  createListing(userId: number, listing: InsertListing, generatedListing: string): Promise<Listing>;
  getListings(userId: number): Promise<Listing[]>;
  getUserListingCount(userId: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private listings: Map<number, Listing>;
  private currentUserId: number;
  private currentListingId: number;

  constructor() {
    this.users = new Map();
    this.listings = new Map();
    this.currentUserId = 1;
    this.currentListingId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      isPremium: false,
      listingsThisMonth: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserListingCount(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    user.listingsThisMonth += 1;
    this.users.set(userId, user);
  }

  async createListing(userId: number, insertListing: InsertListing, generatedListing: string): Promise<Listing> {
    const id = this.currentListingId++;
    const listing: Listing = {
      ...insertListing,
      id,
      userId,
      generatedListing,
      generatedAt: new Date()
    };
    this.listings.set(id, listing);
    return listing;
  }

  async getListings(userId: number): Promise<Listing[]> {
    return Array.from(this.listings.values())
      .filter((listing) => listing.userId === userId)
      .sort((a, b) => (b.generatedAt?.getTime() || 0) - (a.generatedAt?.getTime() || 0));
  }

  async getUserListingCount(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    return user.listingsThisMonth;
  }
}

export const storage = new MemStorage();