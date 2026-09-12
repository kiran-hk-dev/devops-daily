"use client";

import { useState } from "react";

export default function CodeBlock({ title, lang, code }: { title: string; lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/70 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-100">{title}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{lang}</p>
        </div>
        <button
          onClick={copy}
          className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-200 transition hover:border-emerald-500 hover:text-emerald-300"
        >
          {copied ? "copied ✓" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-emerald-100/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
