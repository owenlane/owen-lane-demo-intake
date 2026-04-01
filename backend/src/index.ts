import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import intakeRoutes from "./routes/intake";
import adminRoutes from "./routes/admin";
import bookingRoutes from "./routes/bookings";
import patientRoutes from "./routes/patients";
import buildSubmissionRoutes from "./routes/buildSubmission";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://smilesketchvegas-final.vercel.app",
  "https://smilesketchvegas-final-git-main-owenlanes-projects.vercel.app",
  "https://demo.lanecamposgroup.com",
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedAllowedOrigins = allowedOrigins.map((o) =>
      o.replace(/\/$/, "")
    );

    const isAllowed =
      normalizedAllowedOrigins.includes(normalizedOrigin) ||
      normalizedOrigin.endsWith(".lanecamposgroup.com") ||
      normalizedOrigin.endsWith(".vercel.app");

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later" },
});

app.use("/api", generalLimiter);
app.use("/api/admin", authLimiter);

// ==========================
// ROUTES
// ==========================
app.use("/api/intake", intakeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/build-submission", buildSubmissionRoutes);

// ==========================
// HEALTH CHECK
// ==========================
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ==========================
// 404 HANDLER
// ==========================
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ==========================
// GLOBAL ERROR HANDLER
// ==========================
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`Dental intake API running on port ${PORT}`);
});

export default app;