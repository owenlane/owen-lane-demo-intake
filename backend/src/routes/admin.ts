import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

function buildSubmissionResponse(row: any) {
  const payload = row?.json_payload || {};
  const personalInfo = payload.personalInfo || payload.personal || {};
  const patient = row?.patients || {};

  return {
    id: row.id,
    patient_id: row.patient_id,
    status: row.status,
    created_at: row.created_at,
    first_name: patient.first_name || personalInfo.firstName || "",
    last_name: patient.last_name || personalInfo.lastName || "",
    email: patient.email || personalInfo.email || "",
    json_payload: payload,
    patients: {
      id: patient.id || row.patient_id || "",
      first_name: patient.first_name || personalInfo.firstName || "",
      last_name: patient.last_name || personalInfo.lastName || "",
      email: patient.email || personalInfo.email || "",
      phone: patient.phone || personalInfo.phone || "",
      date_of_birth:
        patient.date_of_birth ||
        personalInfo.dateOfBirth ||
        personalInfo.dob ||
        "",
      address_street:
        patient.address_street ||
        personalInfo.address?.street ||
        (typeof personalInfo.address === "string" ? personalInfo.address : "") ||
        "",
      address_city: patient.address_city || personalInfo.address?.city || "",
      address_state: patient.address_state || personalInfo.address?.state || "",
      address_zip: patient.address_zip || personalInfo.address?.zip || "",
    },
  };
}

// ==========================
// LOGIN
// ==========================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
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
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================
// GET SUBMISSIONS (LIST)
// ==========================
router.get("/submissions", async (_req: Request, res: Response) => {
  try {
    const { data, error, count } = await supabase
      .from("intake_submissions")
      .select("*, patients(*)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("FETCH ERROR:", error);
      return res.status(500).json({ error: "Failed to fetch submissions" });
    }

    const submissions = (data || []).map(buildSubmissionResponse);

    return res.json({
      submissions,
      count: count ?? submissions.length,
    });
  } catch (err) {
    console.error("LIST ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================
// GET SINGLE SUBMISSION
// ==========================
router.get("/submissions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("intake_submissions")
      .select("*, patients(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Submission not found" });
    }

    return res.json(buildSubmissionResponse(data));
  } catch (err) {
    console.error("GET ONE ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================
// UPDATE SUBMISSION STATUS
// ==========================
router.patch("/submissions/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
  "new",
  "contacted",
  "scheduled",
  "checked_in",
  "completed",
  "no_show",
  "cancelled",
];

    if (!allowedStatuses.includes(String(status).toLowerCase())) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const normalizedStatus = String(status).toLowerCase();

    const { data, error } = await supabase
      .from("intake_submissions")
      .update({ status: normalizedStatus })
      .eq("id", id)
      .select("*, patients(*)")
      .single();

    if (error || !data) {
      console.error("STATUS UPDATE ERROR:", error);
      return res
        .status(500)
        .json({ error: "Failed to update submission status" });
    }

    const { error: auditError } = await supabase.from("activity_logs").insert([
      {
        patient_id: data.patient_id,
        submission_id: data.id,
        action: "status_updated",
        metadata: { new_status: normalizedStatus },
      },
    ]);

    if (auditError) {
      console.error("STATUS AUDIT LOG ERROR:", auditError);
    }

    return res.json({
      success: true,
      submission: buildSubmissionResponse(data),
    });
  } catch (err) {
    console.error("PATCH STATUS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================
// CREATE NOTE
// ==========================
router.post("/notes", async (req: Request, res: Response) => {
  try {
    const { patient_id, submission_id, note } = req.body;

    if (!note || !String(note).trim()) {
      return res.status(400).json({ error: "Note is required" });
    }

    const cleanNote = String(note).trim();

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          patient_id: patient_id || null,
          submission_id: submission_id || null,
          note: cleanNote,
          created_by: "admin",
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("CREATE NOTE ERROR:", error);
      return res.status(500).json({ error: "Failed to create note" });
    }

    const { error: auditError } = await supabase.from("activity_logs").insert([
      {
        patient_id: patient_id || null,
        submission_id: submission_id || null,
        action: "note_created",
        metadata: { note: cleanNote },
      },
    ]);

    if (auditError) {
      console.error("NOTE AUDIT LOG ERROR:", auditError);
    }

    return res.json(data);
  } catch (err) {
    console.error("CREATE NOTE ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================
// GET NOTES
// ==========================
router.get("/notes", async (req: Request, res: Response) => {
  try {
    const { patient_id, submission_id } = req.query;

    let query = supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (patient_id) {
      query = query.eq("patient_id", patient_id as string);
    }

    if (submission_id) {
      query = query.eq("submission_id", submission_id as string);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET NOTES ERROR:", error);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }

    return res.json(data || []);
  } catch (err) {
    console.error("GET NOTES ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================
// GET ACTIVITY LOGS
// ==========================
router.get("/activity-logs", async (req: Request, res: Response) => {
  try {
    const { patient_id, submission_id } = req.query;

    if (!patient_id && !submission_id) {
      return res
        .status(400)
        .json({ error: "patient_id or submission_id required" });
    }

    let query = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (patient_id) {
      query = query.eq("patient_id", patient_id as string);
    }

    if (submission_id) {
      query = query.eq("submission_id", submission_id as string);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET ACTIVITY LOGS ERROR:", error);
      return res.status(500).json({ error: "Failed to fetch activity logs" });
    }

    return res.json(data || []);
  } catch (err) {
    console.error("GET ACTIVITY LOGS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;