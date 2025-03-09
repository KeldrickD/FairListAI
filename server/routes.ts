import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateListing } from "./lib/openai";
import { insertListingSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/listings/generate", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check free tier limits
      if (!user.isPremium && user.listingsThisMonth >= 5) {
        return res.status(403).json({ 
          message: "Free tier limit reached. Please upgrade to premium for unlimited listings." 
        });
      }

      const validatedData = insertListingSchema.parse(req.body);

      // Generate listing
      const generatedContent = await generateListing(validatedData);

      // Save listing
      const listing = await storage.createListing(userId, validatedData, generatedContent.listing);
      await storage.updateUserListingCount(userId);

      return res.json({ 
        listing,
        generated: generatedContent
      });
    } catch (error) {
      console.error("Error generating listing:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to generate listing" 
      });
    }
  });

  app.get("/api/listings", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const listings = await storage.getListings(userId);
      return res.json({ listings });
    } catch (error) {
      console.error("Error fetching listings:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch listings" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}