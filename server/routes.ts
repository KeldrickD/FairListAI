import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateListing } from "./lib/openai";
import { insertListingSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express) {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Set session
      req.session.userId = user.id;

      return res.status(201).json({ user });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to register" 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      // Set session
      req.session.userId = user.id;

      return res.json({ user });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to login" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

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

  app.patch("/api/listings/:id", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const listingId = parseInt(req.params.id);
      const { title } = z.object({ title: z.string().min(3).max(100) }).parse(req.body);

      const listing = await storage.updateListingTitle(userId, listingId, title);
      return res.json({ listing });
    } catch (error) {
      console.error("Error updating listing:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to update listing" 
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