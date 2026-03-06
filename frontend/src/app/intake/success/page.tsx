import { CLIENT } from "@/lib/client";
import { CheckCircle2, ShieldCheck, PhoneCall, ClipboardCheck } from "lucide-react";

export default function IntakeSuccessPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const id = searchParams?.id || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-zinc-900 text-steel-50">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[920px] h-[920px] rounded-full bg-red-600/10 blur-3xl opacity-70" />
        <div className="absolute bottom-[-220px] right-[-140px] w-[760px] h-[760px] rounded-full bg-red-700/10 blur-3xl opacity-60" />
        <div className="absolute bottom-[-200px] left-[-120px] w-[680px] h-[680px] rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-16 md:py-24">
        <div className="rounded-3xl border border-white/10 bg-obsidian-900/70 backdrop-blur-2xl shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* top section */}
          <div className="px-8 pt-10 pb-8 text-center border-b border-white/10 bg-white/[0.03]">
            <div className="mx-auto mb-6 w-18 h-18 rounded-3xl bg-redlux-500/15 border border-redlux-500/25 flex items-center justify-center shadow-[0_0_40px_rgba(193,18,31,0.12)]">
              <CheckCircle2 className="w-9 h-9 text-redlux-500" />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel-200/70 mb-4">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Submission Complete
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-steel-50">
              Intake Form Submitted
            </h1>

            <p className="mt-3 text-sm md:text-base text-steel-200/75 max-w-lg mx-auto leading-relaxed">
              Your information has been successfully received. Please save your confirmation ID for your records.
            </p>
          </div>

          {/* content */}
          <div className="p-8">
            <div className="rounded-2xl border border-white/10 bg-obsidian-950/45 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-steel-200/55 mb-2">
                Confirmation ID
              </p>
              <p className="font-mono text-sm md:text-base break-all text-steel-50">
                {id || "—"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="rounded-2xl border border-white/10 bg-obsidian-950/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
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

              <div className="rounded-2xl border border-white/10 bg-obsidian-950/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
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

            <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-1">
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