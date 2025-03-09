import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateListing, generateSEO, generateSocialMedia, generateVideoScript } from "./lib/openai";
import { insertListingSchema, insertUserSchema, SUBSCRIPTION_TIERS, SUBSCRIPTION_PRICES, ADD_ON_PRICES } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
}

// Initialize Stripe with the test secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true
});


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

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.isPremium) {
        return res.status(400).json({ message: "User is already subscribed" });
      }

      const { tier, addOns = [] } = req.body;

      // Validate the tier is supported
      if (!tier || !Object.values(SUBSCRIPTION_TIERS).includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      // Calculate total amount including add-ons
      let amount;
      if (tier === SUBSCRIPTION_TIERS.PAY_PER_USE) {
        amount = 500; // $5.00 per listing
      } else {
        // For subscription tiers, use the subscription prices
        amount = SUBSCRIPTION_PRICES[tier.toLowerCase()];
        // Add any selected add-ons
        addOns.forEach(addon => {
          if (ADD_ON_PRICES[addon]) {
            amount += ADD_ON_PRICES[addon];
          }
        });
      }

      console.log('Creating payment intent:', { tier, amount, addOns }); // Add logging

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ['card'],
        metadata: {
          userId: user.id.toString(),
          tier,
          addOns: JSON.stringify(addOns)
        },
      });

      return res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create payment intent" 
      });
    }
  });

  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const userId = parseInt(paymentIntent.metadata.userId);
      const tier = paymentIntent.metadata.tier;
      const addOns = JSON.parse(paymentIntent.metadata.addOns || "[]");

      try {
        // First upgrade the user's subscription tier
        await storage.upgradeToPremium(userId, tier as keyof typeof SUBSCRIPTION_TIERS);

        // Then enable any purchased add-ons
        if (addOns.length > 0) {
          await storage.updateUserAddOns(userId, addOns);
        }

        console.log(`Successfully processed payment for user ${userId}`, {
          tier,
          addOns,
        });
      } catch (error) {
        console.error("Error processing successful payment:", error);
        return res.status(500).json({ message: "Failed to process payment" });
      }
    }

    res.json({ received: true });
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

      // Generate main listing content
      const generatedContent = await generateListing(validatedData);
      let seoOptimized = null;
      let socialMediaContent = null;
      let videoScript = null;

      // Generate add-on content if user has the features enabled
      if (user.seoEnabled) {
        seoOptimized = await generateSEO(validatedData, generatedContent.listing);
      }

      if (user.socialMediaEnabled) {
        socialMediaContent = await generateSocialMedia(validatedData, generatedContent.listing);
      }

      if (user.videoScriptsEnabled) {
        videoScript = await generateVideoScript(validatedData, generatedContent.listing);
      }

      // Save listing with add-on content
      const listing = await storage.createListing(
        userId,
        validatedData,
        generatedContent.listing,
        seoOptimized,
        socialMediaContent,
        videoScript
      );

      await storage.updateUserListingCount(userId);

      return res.json({
        listing,
        generated: {
          ...generatedContent,
          seoOptimized,
          socialMediaContent,
          videoScript
        }
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