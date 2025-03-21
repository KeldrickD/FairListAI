import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateListing, generateSEO, generateSocialMedia, generateVideoScript } from "./lib/openai";
import { insertListingSchema, insertUserSchema, SUBSCRIPTION_TIERS, SUBSCRIPTION_PRICES, ADD_ON_PRICES, type User } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { eq } from 'drizzle-orm';
import { db } from './index';
import OpenAI from 'openai';

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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
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

// Type for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    subscriptionTier: string;
    isPremium: boolean;
  };
}

// Authentication middleware
const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: Function
) => {
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user.length) {
      req.session.destroy(() => {});
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }
    
    req.user = {
      id: user[0].id,
      username: user[0].username,
      subscriptionTier: user[0].subscriptionTier,
      isPremium: user[0].isPremium,
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
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

  app.get('/api/auth/user', async (req: AuthenticatedRequest, res) => {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }
    
    try {
      const user = await db
        .select({
          id: users.id,
          username: users.username,
          subscriptionTier: users.subscriptionTier,
          isPremium: users.isPremium,
          listingsThisMonth: users.listingsThisMonth,
          listingCredits: users.listingCredits,
          seoEnabled: users.seoEnabled,
          socialMediaEnabled: users.socialMediaEnabled,
          videoScriptsEnabled: users.videoScriptsEnabled,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!user.length) {
        req.session.destroy(() => {});
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }
      
      return res.status(200).json(user[0]);
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });

  app.post('/api/compliance/check', async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({
          success: false,
          message: 'Text is required',
        });
      }

      const promptText = `Analyze the following real estate listing for potential Fair Housing compliance issues:

"${text}"

Identify any potential discriminatory language or content that might violate Fair Housing laws. 
Focus on language related to protected classes: race, color, religion, sex (including gender identity and sexual orientation), disability, familial status, or national origin.

If there are issues, format your response as a JSON array of objects with the following structure:
[
  {
    "type": "warning" or "error",
    "message": "Explain what the issue is",
    "suggestion": "Suggest how to fix it"
  }
]

If there are no issues, return an empty array: []`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content || "{}";
      const issues = JSON.parse(content).issues || [];

      return res.status(200).json({
        success: true,
        data: {
          issues,
        },
      });
    } catch (error) {
      console.error('Compliance check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking compliance',
      });
    }
  });

  app.post('/api/seo/analyze', async (req, res) => {
    try {
      const { title, description } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required',
        });
      }

      const promptText = `Analyze the following real estate listing title and description for SEO:

Title: "${title}"
Description: "${description}"

Provide an SEO analysis with metrics in the following JSON format:
{
  "metrics": [
    {
      "name": "Title Length",
      "score": 85,
      "maxScore": 100,
      "suggestions": ["Make the title a bit shorter to fit better in search results"]
    },
    {
      "name": "Keyword Density",
      "score": 70,
      "maxScore": 100,
      "suggestions": ["Add more relevant keywords naturally throughout the description"]
    }
  ]
}

Analyze the following aspects:
1. Title Length (ideal is 50-60 characters)
2. Keyword Density
3. Readability
4. Use of Location
5. Feature Highlighting
6. Call to Action

For each metric, provide a score out of 100 and actionable suggestions for improvement.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content || "{}";
      const data = JSON.parse(content);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('SEO analysis error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error analyzing SEO',
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