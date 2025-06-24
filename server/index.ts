import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./utils/vite";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import { configurePassport } from "./auth";
import { pool } from "./db";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configure session store with error handling
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool: pool,
  tableName: 'sessions',
  createTableIfMissing: true,
  errorLog: (error: any) => {
    console.error('Session store error:', error);
  }
});

// Configure session with Cloudflare-compatible settings
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'keyboard cat fallback secret',
  resave: false,
  saveUninitialized: true, // Required for proper session creation
  rolling: true, // Reset expiration on activity
  name: 'connect.sid',
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Secure in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict' // Lax for Cloudflare compatibility
  }
}));

// Initialize Passport (disabled for simplified auth)
// app.use(passport.initialize());
// app.use(passport.session());

// Trust proxy for proper HTTPS detection (required for Cloudflare)
app.set('trust proxy', 1);

// Session debugging middleware
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name: string, value: any) {
    if (name.toLowerCase() === 'set-cookie' && typeof value === 'string' && value.includes('connect.sid')) {
      console.log('Session cookie details:', {
        cookie: value.substring(0, 80) + '...',
        secure: value.includes('Secure'),
        httpOnly: value.includes('HttpOnly'),
        sameSite: value.match(/SameSite=([^;]*)/)?.[1] || 'lax',
        domain: req.hostname,
        isProduction: process.env.NODE_ENV === 'production'
      });
    }
    return originalSetHeader.call(this, name, value);
  };
  next();
});

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

(async () => {
  console.log("Starting server without database schema fixes");

  // Configure passport
  configurePassport();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Always return JSON for error responses, never HTML
    res.status(status).json({ 
      message,
      error: process.env.NODE_ENV === 'production' ? 'Server error' : (err.stack || String(err))
    });
    
    // Log but don't rethrow the error
    console.error("Server error:", err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
