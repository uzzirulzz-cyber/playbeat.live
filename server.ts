import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import apiRouter from "./server/routes";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProduction = process.env.NODE_ENV === "production";

  // Middlewares
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Mount API router
  app.use("/api", apiRouter);

  // Direct root endpoint for mobile/iOS Swift GIDSignIn (https://yourbackend.example.com/tokensignin)
  app.use("/tokensignin", (req: Request, res: Response, next) => {
    req.url = "/tokensignin";
    apiRouter(req, res, next);
  });

  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  if (!isProduction) {
    // Development mode with Vite middleware
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));

    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PlayBeat SaaS Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
  process.exit(1);
});
