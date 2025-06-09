import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { configurePassport } from "./production-auth";
import { pool } from "./db";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configure session store
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool: pool,
  tableName: 'sessions',
  createTableIfMissing: true
});

// Configure session
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));

// Configure Authentication (passport-free for ESM compatibility)
configurePassport();

// Logging middleware
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

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

// Production static file serving
function serveStatic(app: express.Express) {
  const possiblePaths = [
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "..", "public"),
    "/app/public",
    path.resolve(__dirname, "..", "dist", "client"),
    path.resolve(process.cwd(), "dist", "client"),
    path.resolve(process.cwd(), "public")
  ];
  
  let distPath = null;
  
  for (const pathToCheck of possiblePaths) {
    if (fs.existsSync(pathToCheck)) {
      distPath = pathToCheck;
      console.log(`Found client build files at: ${distPath}`);
      break;
    }
  }
  
  if (!distPath) {
    throw new Error(
      `Could not find the build directory in any of these locations: ${possiblePaths.join(', ')}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  console.log("Starting production server");

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ 
      message,
      error: process.env.NODE_ENV === 'production' ? 'Server error' : (err.stack || String(err))
    });
    
    console.error("Server error:", err);
  });

  // Serve static files in production
  serveStatic(app);

  const port = parseInt(process.env.PORT || "5000");
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();