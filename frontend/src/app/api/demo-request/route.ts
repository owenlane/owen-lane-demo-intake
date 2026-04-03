import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function pickArray(...values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value;
  }
  return [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("demo-request received body:", body);

    const contactName = pickString(
      body.contactName,
      body.name,
      body.fullName,
      body.ownerName,
      body.fd?.contactName,
      body.fd?.name,
      body.fd?.fullName,
      body.fd?.ownerName
    );

    const practiceName = pickString(
      body.org,
      body.organization,
      body.practice,
      body.practiceName,
      body.officeName,
      body.company,
      body.fd?.org,
      body.fd?.organization,
      body.fd?.practice,
      body.fd?.practiceName,
      body.fd?.officeName,
      body.fd?.company
    );

    const email = pickString(
      body.email,
      body.contactEmail,
      body.fd?.email,
      body.fd?.contactEmail
    );

    const phone = pickString(
      body.phone,
      body.contactPhone,
      body.fd?.phone,
      body.fd?.contactPhone
    );

    const doctorName =
      pickString(
        body.doctorName,
        body.doctor,
        body.fd?.doctorName,
        body.fd?.doctor
      ) || "Dr. Persky";

    const buildType =
      pickString(
        body.buildType,
        body.projectType,
        body.fd?.buildType,
        body.fd?.projectType
      ) || "POI Build";

    const intakeSelections = pickArray(
      body.intake,
      body.intakeNeeds,
      body.goals,
      body.features,
      body.fd?.intake,
      body.fd?.intakeNeeds,
      body.fd?.goals,
      body.fd?.features
    );

    const notes = pickString(
      body.context,
      body.notes,
      body.message,
      body.description,
      body.details,
      body.fd?.context,
      body.fd?.notes,
      body.fd?.message,
      body.fd?.description,
      body.fd?.details
    );

    const intakeText =
      typeof body.context === "string" && body.context.trim()
        ? body.context.trim()
        : typeof body.intake === "string" && body.intake.trim()
        ? body.intake.trim()
        : intakeSelections.length
        ? intakeSelections.join(", ")
        : notes || "No additional intake details provided.";

    if (!contactName || !practiceName || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
          debug: {
            receivedKeys: Object.keys(body || {}),
            contactName,
            practiceName,
            email,
            phone,
            intakeText,
          },
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/build-submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        practiceName,
        doctorName,
        contactName,
        email,
        phone,
        buildType,
        notes: intakeText,
      }),
    });

    const raw = await response.text();
    let data: any = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = { raw };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || "Failed to send build submission.",
          backend: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, backend: data });
  } catch (error) {
    console.error("Demo request route error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error.",
      },
      { status: 500 }
    );
  }
}