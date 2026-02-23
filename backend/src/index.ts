import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import intakeRoutes from "./routes/intake";
import adminRoutes from "./routes/admin";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// If you're behind Render/Proxies, rate-limit + req.ip behaves better with this:
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS (allow your local dev + your deployed frontend)
const allowedOrigins = [
  process.env.FRONTEND_URL,          // e.g. https://your-frontend.vercel.app
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser requests (like curl/postman) with no origin
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later" },
});

// Apply limiters
app.use("/api", generalLimiter);
app.use("/api/admin/login", authLimiter);

// Routes
app.use("/api/intake", intakeRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`Dental intake API running on port ${PORT}`);
});

export default app;