import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET PATIENTS ERROR:", error);
      return res.status(500).json({ error: "Failed to fetch patients" });
    }

    return res.json({
      patients: data || [],
      count: (data || []).length,
    });
  } catch (err) {
    console.error("GET PATIENTS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (patientError || !patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const { data: submissions, error: submissionsError } = await supabase
      .from("intake_submissions")
      .select("*")
      .eq("patient_id", id)
      .order("created_at", { ascending: false });

    if (submissionsError) {
      console.error("GET PATIENT SUBMISSIONS ERROR:", submissionsError);
      return res.status(500).json({ error: "Failed to fetch patient submissions" });
    }

    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("patient_id", id)
      .order("created_at", { ascending: false });

    if (notesError) {
      console.error("GET PATIENT NOTES ERROR:", notesError);
      return res.status(500).json({ error: "Failed to fetch patient notes" });
    }

    const { data: activityLogs, error: activityError } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("patient_id", id)
      .order("created_at", { ascending: false });

    if (activityError) {
      console.error("GET PATIENT ACTIVITY ERROR:", activityError);
      return res.status(500).json({ error: "Failed to fetch patient activity logs" });
    }

    return res.json({
      patient,
      submissions: submissions || [],
      notes: notes || [],
      activityLogs: activityLogs || [],
    });
  } catch (err) {
    console.error("GET PATIENT DETAIL ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;