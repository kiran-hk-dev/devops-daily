import type { ArchNode } from "@/lib/modules";

const toneStyles: Record<string, string> = {
  slate: "border-zinc-700 bg-zinc-900 text-zinc-100",
  blue: "border-sky-700 bg-sky-950 text-sky-100",
  green: "border-emerald-700 bg-emerald-950 text-emerald-100",
  amber: "border-amber-700 bg-amber-950 text-amber-100",
  red: "border-red-700 bg-red-950 text-red-100",
  purple: "border-violet-700 bg-violet-950 text-violet-100",
};

const toneDots: Record<string, string> = {
  slate: "bg-zinc-400",
  blue: "bg-sky-400",
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
  purple: "bg-violet-400",
};

export function FlowDiagram({ nodes, note }: { nodes: ArchNode[]; note?: string }) {
  return (
    <div className="anim-flow rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="live-dot" aria-hidden />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-zinc-500">
          live traffic flow
        </span>
      </div>
      <div className="flex flex-col items-stretch gap-0">
        {nodes.map((n, i) => {
          const tone = n.tone ?? "slate";
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`flow-node node-in w-full max-w-xl rounded-lg border px-4 py-3 text-center shadow-sm ${toneStyles[tone]}`}
                style={{ animationDelay: `${Math.min(i * 130, 1300)}ms` }}
              >
                <p className="flex items-center justify-center gap-2 text-sm font-bold leading-snug">
                  <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${toneDots[tone]}`} aria-hidden />
                  {n.label}
                </p>
                {n.detail && <p className="mt-0.5 font-mono text-[11px] opacity-80">{n.detail}</p>}
              </div>
              {i < nodes.length - 1 && (
                <div className="flow-connector" aria-hidden>
                  <div className="flow-track">
                    <span
                      className="flow-packet"
                      style={{ animationDelay: `${(i * 0.35) % 1.8}s` }}
                    />
                  </div>
                  <span className="flow-chev" style={{ animationDelay: `${(i * 0.35) % 1.8}s` }}>
                    ▾
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {note && (
        <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-[13px] leading-relaxed text-zinc-300">
          <span className="font-semibold text-amber-300">How to read: </span>
          {note}
        </p>
      )}
    </div>
  );
}

export function PipelineStrip({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-[11px] text-zinc-200">
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="strip-arrow" style={{ animationDelay: `${i * 180}ms` }} aria-hidden>
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
