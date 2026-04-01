import { Router, Request, Response } from "express";
import { z } from "zod";
import { sendBuildSubmissionEmail } from "../lib/mailer";

const router = Router();

const directSchema = z.object({
  practiceName: z.string().min(1, "Practice name is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  buildType: z.string().min(1, "Build type is required"),
  notes: z.string().min(1, "Notes are required"),
});

function toJoinedString(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return "";
}

function normalizeLegacyPayload(body: any) {
  const notesParts = [
    toJoinedString(body.cd) ? `Color Direction: ${toJoinedString(body.cd)}` : "",
    toJoinedString(body.vs) ? `Visual Style: ${toJoinedString(body.vs)}` : "",
    typeof body.bn === "string" && body.bn.trim() ? `Brand Notes: ${body.bn.trim()}` : "",

    toJoinedString(body.fp) ? `Frontend Priorities: ${toJoinedString(body.fp)}` : "",
    typeof body.fn === "string" && body.fn.trim() ? `Frontend Notes: ${body.fn.trim()}` : "",

    toJoinedString(body.bp) ? `Backend Priorities: ${toJoinedString(body.bp)}` : "",
    typeof body.bnn === "string" && body.bnn.trim() ? `Backend Notes: ${body.bnn.trim()}` : "",

    toJoinedString(body.ap) ? `Future Intelligence: ${toJoinedString(body.ap)}` : "",
    typeof body.an === "string" && body.an.trim() ? `AI Notes: ${body.an.trim()}` : "",

    typeof body.pa === "string" && body.pa.trim() ? `Pain Points: ${body.pa.trim()}` : "",
    typeof body.im === "string" && body.im.trim() ? `Improvements: ${body.im.trim()}` : "",
    typeof body.ta === "string" && body.ta.trim() ? `Immediate Targets: ${body.ta.trim()}` : "",

    typeof body.cu === "string" && body.cu.trim() ? `Custom Requests: ${body.cu.trim()}` : "",
    typeof body.sp === "string" && body.sp.trim() ? `Special Requirements: ${body.sp.trim()}` : "",
    typeof body.ad === "string" && body.ad.trim() ? `Additional Notes: ${body.ad.trim()}` : "",

    typeof body.source === "string" && body.source.trim() ? `Source: ${body.source.trim()}` : "",
    typeof body.submittedAt === "string" && body.submittedAt.trim()
      ? `Submitted At: ${body.submittedAt.trim()}`
      : "",
  ].filter(Boolean);

  return {
    practiceName: typeof body.pn === "string" ? body.pn.trim() : "",
    doctorName: "Dr. Persky",
    contactName: typeof body.cn === "string" ? body.cn.trim() : "",
    email: typeof body.em === "string" ? body.em.trim() : "",
    phone: typeof body.ph === "string" ? body.ph.trim() : "",
    buildType: "POI Build",
    notes: notesParts.join("\n\n") || "No additional notes provided.",
  };
}

router.post("/", async (req: Request, res: Response) => {
  try {
    let payload = req.body;

    const directParsed = directSchema.safeParse(payload);

    if (!directParsed.success) {
      payload = normalizeLegacyPayload(req.body);
    } else {
      payload = directParsed.data;
    }

    const finalParsed = directSchema.safeParse(payload);

    if (!finalParsed.success) {
      return res.status(400).json({
        error: "Invalid submission data",
        details: finalParsed.error.flatten(),
      });
    }

    await sendBuildSubmissionEmail(finalParsed.data);

    return res.status(200).json({
      success: true,
      message: "Build submission sent successfully",
    });
  } catch (error) {
    console.error("Build submission error:", error);

    return res.status(500).json({
      error: "Failed to send build submission",
    });
  }
});

export default router;