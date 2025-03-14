import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import dotenv from "dotenv";
import { join } from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup with environment variable
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5000';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Session configuration with secure settings
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax'
    }
  })
);

// Remove the temporary test user creation since we now have proper auth
app.use((req, res, next) => {
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Configuration
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/fairlistai';
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret123';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Database setup
const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool);

async function main() {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  // Initialize storage
  await storage.init();

  // Serve static files in production, use Vite in development
  if (NODE_ENV === 'production') {
    const staticPath = join(__dirname, 'public');
    app.use(express.static(staticPath));
    
    // Catch-all route for SPA
    app.get('*', (req, res) => {
      res.sendFile(join(staticPath, 'index.html'));
    });
  } else {
    // Setup Vite middleware in development
    await setupVite(app, server);
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});