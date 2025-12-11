import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("setupVite should not be called in production");
  }

  // Dynamic imports for development dependencies
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteConfig = (await import("../../vite.config")).default;
  const { nanoid } = await import("nanoid");
  
  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg: string, options: any) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use( async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Simplified production static file serving
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Production: serve from known Docker paths
    const productionPaths = ["/app/dist/public", "/app/public"];
    
    for (const staticPath of productionPaths) {
      if (fs.existsSync(staticPath)) {
        console.log(`Serving static files from: ${staticPath}`);
        app.use(express.static(staticPath));
        return;
      }
    }
    
    // Fallback: serve minimal static content for production
    console.log("Static files not found, serving minimal content");
    app.get('(.*)', (req, res) => {
      if (req.path.startsWith('/api/')) return; // Skip API routes
      res.send('<!DOCTYPE html><html><head><title>Risk Platform</title></head><body><div id="root">Loading...</div></body></html>');
    });
    return;
  }
  
  // Development: check multiple paths
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public")
  ];
  
  let distPath = null;
  
  // Find the first path that exists
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

  // fall through to index.html if the file doesn't exist
  app.use( (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
