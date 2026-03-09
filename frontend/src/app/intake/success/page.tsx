import { CLIENT } from "@/lib/client";
import { ShieldCheck, PhoneCall } from "lucide-react";

export default function IntakeSuccessPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const id = searchParams?.id || "";

  return (
    <div className="min-h-screen bg-white text-steel-50">
      <div className="relative max-w-2xl mx-auto px-4 py-16 md:py-24">
        <div className="rounded-3xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="px-8 pt-10 pb-8 text-center border-b border-black/10 bg-obsidian-900">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-steel-50">
              Intake Form Submitted
            </h1>

            <p className="mt-3 text-sm md:text-base text-steel-200/85 max-w-lg mx-auto leading-relaxed">
              Your information has been successfully received.
            </p>
          </div>

          <div className="p-8">
            <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-steel-200/55 mb-2">
                Confirmation ID
              </p>
              <p className="font-mono text-sm md:text-base break-all text-steel-50">
                {id || "—"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-redlux-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-steel-50">Secure Submission</p>
                    <p className="text-xs text-steel-200/65 mt-1 leading-relaxed">
                      Your intake details have been securely recorded for office review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-redlux-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-steel-50">Need Assistance?</p>
                    <p className="text-xs text-steel-200/65 mt-1 leading-relaxed">
                      Contact the office directly at {CLIENT.phone} if you need help or updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-black/10 text-center space-y-1">
              <p className="text-xs uppercase tracking-wider text-steel-200/45">
                {CLIENT.systemProvider}
              </p>
              <p className="text-[11px] text-steel-200/35">
                {CLIENT.systemTagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}