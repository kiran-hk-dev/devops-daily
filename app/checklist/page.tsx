"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { checklistItems } from "@/lib/modules";

const KEY = "eks-lab-checklist-v1";

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(checked));
    } catch { /* ignore */ }
  }, [checked, loaded]);

  const total = useMemo(() => checklistItems.reduce((n, g) => n + g.items.length, 0), []);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  const toggle = (item: string) => setChecked((c) => ({ ...c, [item]: !c[item] }));
  const reset = () => setChecked({});

  const exportText = async () => {
    const lines = [`EKS PRODUCTION GO-LIVE — ${done}/${total} (${pct}%)`, ""];
    for (const g of checklistItems) {
      lines.push(`## ${g.group}`);
      for (const i of g.items) lines.push(`[${checked[i] ? "x" : " "}] ${i}`);
      lines.push("");
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setExported(true);
      setTimeout(() => setExported(false), 1500);
    } catch { /* ignore */ }
  };

  const go = done === total;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/modules/deployment-checklist" className="text-[13px] font-bold text-emerald-400 hover:text-emerald-300">
        ← Lab #63 theory
      </Link>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Production go-live checklist</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Lab #63, interactive. Every box needs evidence (command output or URL). Progress saves in this browser.
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm font-bold text-zinc-200">{done}/{total} · {pct}%</p>
          <div className="flex gap-2">
            <button onClick={exportText} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-200 hover:border-emerald-500">
              {exported ? "copied ✓" : "export"}
            </button>
            <button onClick={reset} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400 hover:border-red-600 hover:text-red-300">
              reset
            </button>
          </div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all ${go ? "bg-emerald-400" : "bg-emerald-600"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {go ? (
          <p className="mt-3 rounded-lg border border-emerald-800 bg-emerald-950/60 px-4 py-3 text-sm font-bold text-emerald-200">
            ✅ GO FOR PROD — attach this export to the release ticket. Rollback tested? Backup verified? Then ship.
          </p>
        ) : (
          <p className="mt-3 text-[13px] text-zinc-500">
            No box, no prod. Red path first: HTTPS, ALB health, secrets, RBAC, rollback.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {checklistItems.map((g) => {
          const gDone = g.items.filter((i) => checked[i]).length;
          return (
            <section key={g.group} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-black text-white">{g.group}</h2>
                <span className="font-mono text-xs text-zinc-500">{gDone}/{g.items.length}</span>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                {g.items.map((item) => {
                  const on = !!checked[item];
                  return (
                    <button
                      key={item}
                      onClick={() => toggle(item)}
                      className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[13.5px] transition ${
                        on
                          ? "border-emerald-800 bg-emerald-950/40 text-emerald-100"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-black ${
                          on ? "border-emerald-500 bg-emerald-500 text-zinc-950" : "border-zinc-600 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={on ? "line-through opacity-80" : ""}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
