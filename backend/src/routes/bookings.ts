import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const ALLOWED_STATUSES = ["new", "contacted", "scheduled", "cancelled"];

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error, count } = await supabase
      .from("booking_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET BOOKINGS ERROR:", error);
      return res.status(500).json({ error: "Failed to fetch booking requests" });
    }

    return res.json({
      bookings: data || [],
      count: count ?? 0,
    });
  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Booking request not found" });
    }

    return res.json(data);
  } catch (err) {
    console.error("GET BOOKING ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      appointment_type,
      preferred_date,
      preferred_time,
      provider,
      notes,
      source,
    } = req.body;

    const { data, error } = await supabase
      .from("booking_requests")
      .insert([
        {
          first_name,
          last_name,
          email,
          phone,
          appointment_type,
          preferred_date,
          preferred_time,
          provider,
          notes,
          source: source || "website",
          status: "new",
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("CREATE BOOKING ERROR:", error);
      return res.status(500).json({ error: "Failed to create booking request" });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const normalizedStatus = String(req.body?.status || "").toLowerCase().trim();

    if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data, error } = await supabase
      .from("booking_requests")
      .update({ status: normalizedStatus })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      console.error("UPDATE BOOKING STATUS ERROR:", error);
      return res.status(500).json({ error: "Failed to update booking request status" });
    }

    await supabase.from("activity_logs").insert([
      {
        patient_id: data.linked_patient_id || null,
        action: "booking_status_updated",
        metadata: {
          booking_request_id: data.id,
          new_status: normalizedStatus,
        },
      },
    ]);

    return res.json({
      success: true,
      booking: data,
    });
  } catch (err) {
    console.error("UPDATE BOOKING STATUS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;