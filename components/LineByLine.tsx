import type { LineStep } from "@/lib/modules";

export default function LineByLine({ steps }: { steps: LineStep[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((s, i) => (
        <li key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-[11px] font-black text-emerald-300">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 font-mono text-[12.5px] leading-relaxed text-emerald-100/90">
                <code>{s.code}</code>
              </pre>
              <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-300">
                <span className="font-bold text-amber-300">What this means: </span>
                {s.explanation}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
