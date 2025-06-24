import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./utils/vite";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import { configurePassport } from "./auth";
import { pool } from "./db";

const app = express();

// Trust proxy MUST be set BEFORE session middleware for secure cookies
// For Cloudflare proxy setup, trust the first proxy
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configure PostgreSQL session store
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool: pool,
  tableName: 'sessions',
  createTableIfMissing: true
});

console.log('PostgreSQL session store configured');

// Configure session middleware with production-specific cookie settings
const isProduction = process.env.NODE_ENV === 'production';
const sessionConfig = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'keyboard cat fallback secret',
  resave: false,
  saveUninitialized: true,
  rolling: true,
  name: 'connect.sid',
  cookie: { 
    secure: isProduction, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' as const : 'strict' as const,
    path: '/',
    // Don't set domain in production to allow for subdomain flexibility
    domain: undefined
  }
};

console.log('Session configuration:', {
  nodeEnv: process.env.NODE_ENV,
  cookieSecure: sessionConfig.cookie.secure,
  sameSite: sessionConfig.cookie.sameSite,
  domain: sessionConfig.cookie.domain,
  trustProxy: app.get('trust proxy')
});

app.use(session(sessionConfig));

// Initialize Passport (disabled for simplified auth)
// app.use(passport.initialize());
// app.use(passport.session());

// Enhanced session debugging middleware
app.use((req, res, next) => {
  // Debug all authentication-related requests
  if (req.path.includes('/auth/')) {
    console.log('AUTH REQUEST DEBUG:', {
      method: req.method,
      path: req.path,
      hasSession: !!(req as any).session,
      sessionId: (req as any).session?.id,
      cookies: req.headers.cookie ? 'present' : 'missing',
      host: req.headers.host,
      userAgent: req.headers['user-agent']?.substring(0, 50),
      protocol: req.protocol,
      secure: req.secure,
      forwardedProto: req.get('x-forwarded-proto'),
      nodeEnv: process.env.NODE_ENV
    });
  }

  // Intercept and log all Set-Cookie headers with production debugging
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name: string, value: any) {
    if (name.toLowerCase() === 'set-cookie') {
      console.log('SET-COOKIE HEADER:', {
        path: req.path,
        cookieValue: Array.isArray(value) ? value : [value],
        hostname: req.hostname,
        protocol: req.protocol,
        secure: req.secure,
        isProduction: process.env.NODE_ENV === 'production',
        trustProxy: req.app.get('trust proxy'),
        headers: {
          host: req.headers.host,
          'x-forwarded-proto': req.headers['x-forwarded-proto'],
          'x-forwarded-for': req.headers['x-forwarded-for']
        }
      });
    }
    return originalSetHeader.call(this, name, value);
  };

  // Debug response completion
  res.on('finish', () => {
    if (req.path.includes('/auth/')) {
      console.log('AUTH RESPONSE COMPLETE:', {
        path: req.path,
        statusCode: res.statusCode,
        hasSetCookie: res.getHeaders()['set-cookie'] ? 'yes' : 'no'
      });
    }
  });

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
