import { users, type User, type InsertUser, listings, type Listing, type InsertListing } from "@shared/schema";

enum SUBSCRIPTION_TIERS {
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserListingCount(userId: number): Promise<void>;
  upgradeToPremium(userId: number, tier?: keyof typeof SUBSCRIPTION_TIERS): Promise<User>;
  createListing(userId: number, listing: InsertListing, generatedListing: string, seoOptimized: string | null, socialMediaContent: string | null, videoScript: string | null): Promise<Listing>;
  updateListingTitle(userId: number, listingId: number, title: string): Promise<Listing>;
  getListings(userId: number): Promise<Listing[]>;
  getUserListingCount(userId: number): Promise<number>;
  updateUserAddOns(userId: number, addOns: string[]): Promise<User>;
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
      listingsThisMonth: 0,
      subscriptionTier: SUBSCRIPTION_TIERS.BASIC, 
      seoEnabled: false,
      socialMediaEnabled: false,
      videoScriptsEnabled: false,
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

  async upgradeToPremium(userId: number, tier: keyof typeof SUBSCRIPTION_TIERS = SUBSCRIPTION_TIERS.BASIC): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser: User = {
      ...user,
      isPremium: true,
      subscriptionTier: tier,
      seoEnabled: tier === SUBSCRIPTION_TIERS.PRO || tier === SUBSCRIPTION_TIERS.ENTERPRISE,
      socialMediaEnabled: tier === SUBSCRIPTION_TIERS.PRO || tier === SUBSCRIPTION_TIERS.ENTERPRISE,
      videoScriptsEnabled: tier === SUBSCRIPTION_TIERS.ENTERPRISE,
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createListing(
    userId: number, 
    insertListing: InsertListing, 
    generatedListing: string,
    seoOptimized: string | null = null,
    socialMediaContent: string | null = null,
    videoScript: string | null = null
  ): Promise<Listing> {
    const id = this.currentListingId++;
    const listing: Listing = {
      ...insertListing,
      id,
      userId,
      generatedListing,
      seoOptimized,
      socialMediaContent,
      videoScript,
      generatedAt: new Date()
    };
    this.listings.set(id, listing);
    return listing;
  }

  async updateListingTitle(userId: number, listingId: number, title: string): Promise<Listing> {
    const listing = Array.from(this.listings.values()).find(
      (l) => l.id === listingId && l.userId === userId
    );

    if (!listing) {
      throw new Error("Listing not found or unauthorized");
    }

    const updatedListing = { ...listing, title };
    this.listings.set(listingId, updatedListing);
    return updatedListing;
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

  async updateUserAddOns(userId: number, addOns: string[]): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser: User = {
      ...user,
      seoEnabled: addOns.includes('SEO_OPTIMIZATION'),
      socialMediaEnabled: addOns.includes('SOCIAL_MEDIA'),
      videoScriptsEnabled: addOns.includes('VIDEO_SCRIPT')
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();