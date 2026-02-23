import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import intakeRoutes from "./routes/intake";
import adminRoutes from "./routes/admin";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// --- Security headers ---
app.use(helmet());

// --- CORS ---
// In production, set FRONTEND_URL to your Vercel domain (e.g. https://owen-lane-demo.vercel.app)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// --- Body parsing ---
app.use(express.json({ limit: "1mb" }));

// --- Rate limiting ---
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later" },
});

app.use("/api", generalLimiter);
app.use("/api/admin/login", authLimiter);

// --- Routes ---
app.use("/api/intake", intakeRoutes);
app.use("/api/admin", adminRoutes);

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- 404 ---
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// --- Error handler ---
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Dental intake API running on port ${PORT}`);
});

export default app;