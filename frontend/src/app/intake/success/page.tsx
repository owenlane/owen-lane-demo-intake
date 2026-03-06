import { CLIENT } from "@/lib/client";
import { CheckCircle2 } from "lucide-react";

export default function IntakeSuccessPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const id = searchParams?.id || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-zinc-900 text-steel-50">
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-white/10 bg-obsidian-900/70 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)] p-8 text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-redlux-500/15 border border-redlux-500/25 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-redlux-500" />
          </div>

          <h1 className="font-display text-3xl font-bold text-steel-50">
            Form Submitted
          </h1>

          <p className="mt-2 text-sm text-steel-200/80">
            Your intake form has been received. Save your confirmation ID.
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-obsidian-950/50 p-4 text-left">
            <p className="text-[11px] uppercase tracking-wider text-steel-200/70">
              Confirmation ID
            </p>
            <p className="mt-1 font-mono text-sm break-all text-steel-50">
              {id || "—"}
            </p>
          </div>

          <p className="mt-6 text-sm text-steel-200/70">
            Questions? Call {CLIENT.phone}.
          </p>

          <div className="mt-6 text-xs text-steel-200/50">
            {CLIENT.name}
          </div>
        </div>
      </div>
    </div>
  );
}
