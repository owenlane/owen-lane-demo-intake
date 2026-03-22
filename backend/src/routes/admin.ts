import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// ==========================
// LOGIN
// ==========================
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === "admin@smilesketch.com" && password === "password123") {
    const token = jwt.sign(
      { userId: "demo", email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: "demo",
        email,
        role: "admin",
      },
    });
  }

  return res.status(401).json({ error: "Invalid email or password" });
});

// ==========================
// GET SUBMISSIONS
// ==========================
router.get("/submissions", async (_req: Request, res: Response) => {
  const { data, error, count } = await supabase
    .from("intake_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("FETCH ERROR:", error);
    return res.status(500).json({ error: "Failed to fetch submissions" });
  }

  const submissions = (data || []).map((row: any) => {
    const payload = row.json_payload || {};
    const personal = payload.personal || {};
    const contact = payload.contact || {};

    return {
      id: row.id,
      patient_id: row.patient_id,
      status: row.status,
      created_at: row.created_at,
      first_name: personal.firstName || "",
      last_name: personal.lastName || "",
      email: contact.email || "",
      json_payload: payload,
    };
  });

  return res.json({
    submissions,
    count: count ?? submissions.length,
  });
});

export default router;