"use client";

import { useState } from "react";
import Link from "next/link";
import { troubleshootingFlow } from "@/lib/modules";
import CodeBlock from "@/components/CodeBlock";

export default function TroubleshootingPage() {
  const [active, setActive] = useState(0);
  const [cleared, setCleared] = useState<Record<number, boolean>>({});
  const step = troubleshootingFlow[active];
  const clearedCount = Object.values(cleared).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/modules/connectivity-troubleshooting-flow" className="text-[13px] font-bold text-emerald-400 hover:text-emerald-300">
        ← Lab #59 theory
      </Link>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Connectivity triage — the strict flow</h1>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        DNS → route → SG → NACL → LB → target → service → endpoint → pod → app → DB.
        Stop at the <span className="text-amber-300">first layer that lies</span>. Never restart workloads to “see”.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {troubleshootingFlow.map((s, i) => (
            <li key={s.layer} className="min-w-[150px] lg:min-w-0">
              <button
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition ${
                  i === active
                    ? "border-emerald-600 bg-emerald-950/50"
                    : cleared[i]
                      ? "border-zinc-800 bg-zinc-900/50 opacity-80"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-black ${
                    cleared[i] ? "bg-emerald-500 text-zinc-950" : i === active ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {cleared[i] ? "✓" : i + 1}
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-zinc-100">{s.layer}</span>
                  <span className="block text-[11px] text-zinc-500">{cleared[i] ? "cleared" : "check"}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Step {active + 1} / {troubleshootingFlow.length}
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">{step.layer}</h2>
          <p className="mt-2 text-[15px] font-semibold text-amber-200">❓ {step.question}</p>
          <div className="mt-4 flex flex-col gap-3">
            <CodeBlock title={`${step.layer} — proving commands`} lang="bash" code={step.commands.join("\n")} />
            <div className="rounded-xl border border-violet-900 bg-violet-950/40 p-4">
              <p className="text-[13.5px] leading-relaxed text-violet-100">
                <span className="font-black">🔧 If this layer lies → </span>
                {step.fix}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCleared((c) => ({ ...c, [active]: true }));
                setActive(Math.min(active + 1, troubleshootingFlow.length - 1));
              }}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:bg-emerald-400"
            >
              Layer healthy → next →
            </button>
            <button
              onClick={() => setActive(Math.max(active - 1, 0))}
              disabled={active === 0}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-zinc-200 disabled:opacity-40"
            >
              ← back
            </button>
            {active === troubleshootingFlow.length - 1 && (
              <Link href="/incidents" className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-2.5 text-sm font-extrabold text-red-200">
                Found it? Run the 503 sim →
              </Link>
            )}
          </div>
          <p className="mt-4 font-mono text-xs text-zinc-500">{clearedCount}/{troubleshootingFlow.length} layers cleared</p>
        </div>
      </div>
    </div>
  );
}
