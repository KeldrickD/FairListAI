import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateListing, generateSEO, generateSocialMedia, generateVideoScript } from "./lib/openai";
import { insertListingSchema, insertUserSchema, SUBSCRIPTION_TIERS, SUBSCRIPTION_PRICES, ADD_ON_PRICES, type User } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import Stripe from "stripe";

// Initialize Stripe with development mode handling
const isDevelopment = process.env.NODE_ENV !== 'production';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || (isDevelopment ? 'dummy_key_for_development' : '');
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || (isDevelopment ? 'dummy_webhook_secret' : '');

if (!isDevelopment && !process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key is required in production mode");
}

if (!isDevelopment && !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Stripe webhook secret is required in production mode");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as const,
  typescript: true
});

// Helper to get raw body for Stripe webhook
async function getRawBody(req: Request): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    
    req.on('error', reject);
  });
}

// Helper function to validate session
const validateSession = (req: any) => {
  const userId = req.session?.userId;
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
};

const VALID_SUBSCRIPTION_TIERS = ['basic', 'pro', 'enterprise', 'pay_per_use'] as const;
type ValidSubscriptionTier = typeof VALID_SUBSCRIPTION_TIERS[number];

interface PaymentRequestBody {
  tier: keyof typeof SUBSCRIPTION_TIERS;
  addOns?: Array<keyof typeof ADD_ON_PRICES>;
}

// Helper function to convert tier to storage format
const getStorageTier = (tier: ValidSubscriptionTier): string => {
  if (tier === 'pay_per_use') return 'PAY_PER_USE';
  return tier.toUpperCase();
};

export async function registerRoutes(app: Express) {
  // Auth middleware
  const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  };

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

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

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json({ user: userWithoutPassword });
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

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
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
      const userId = validateSession(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.isPremium) {
        return res.status(400).json({ message: "User is already subscribed" });
      }

      const { tier, addOns = [] } = req.body as PaymentRequestBody;
      const normalizedTier = tier.toLowerCase() as ValidSubscriptionTier;

      if (!VALID_SUBSCRIPTION_TIERS.includes(normalizedTier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      let amount: number = 0;
      if (normalizedTier === 'pay_per_use') {
        amount = 500; // $5.00 per listing
      } else if (normalizedTier in SUBSCRIPTION_PRICES) {
        amount = SUBSCRIPTION_PRICES[normalizedTier as keyof typeof SUBSCRIPTION_PRICES];
        addOns.forEach((addon: keyof typeof ADD_ON_PRICES) => {
          amount += ADD_ON_PRICES[addon];
        });
      } else {
        return res.status(400).json({ message: "Invalid subscription tier pricing" });
      }

      const storageTier = getStorageTier(normalizedTier);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: "usd",
        payment_method_types: ['card'],
        metadata: {
          userId: user.id.toString(),
          tier: storageTier,
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
    try {
      const rawBody = await getRawBody(req);
      const sig = req.headers["stripe-signature"];
      
      if (!sig) {
        return res.status(400).json({ message: "No Stripe signature found" });
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = parseInt(paymentIntent.metadata.userId);
        const tierValue = paymentIntent.metadata.tier as typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];
        const addOns = JSON.parse(paymentIntent.metadata.addOns || "[]");

        try {
          // Only upgrade premium features for supported tiers
          if (tierValue === SUBSCRIPTION_TIERS.BASIC || tierValue === SUBSCRIPTION_TIERS.PRO || tierValue === SUBSCRIPTION_TIERS.ENTERPRISE) {
            await storage.upgradeToPremium(userId, tierValue.toUpperCase() as "BASIC" | "PRO" | "ENTERPRISE");
          }

          // Then enable any purchased add-ons
          if (addOns.length > 0) {
            await storage.updateUserAddOns(userId, addOns);
          }

          console.log(`Successfully processed payment for user ${userId}`, {
            tier: tierValue,
            addOns,
          });
        } catch (error) {
          console.error("Error processing successful payment:", error);
          return res.status(500).json({ message: "Failed to process payment" });
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Error handling webhook:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/listings/generate", requireAuth, async (req, res) => {
    try {
      const user = req.user!;

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
        user.id,
        validatedData,
        generatedContent.listing,
        seoOptimized,
        socialMediaContent,
        videoScript
      );

      // Update user's listing count
      await storage.updateUserListingCount(user.id);

      return res.json({ listing });
    } catch (error) {
      console.error("Error generating listing:", error);
      return res.status(500).json({
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

  return createServer(app);
}

// Add type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}