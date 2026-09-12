"use client";

import { useMemo, useState } from "react";
import { modules, categories } from "@/lib/modules";
import ModuleCard from "@/components/ModuleCard";

const trackOf = (id: number) => {
  if (id <= 29) return ["track-basics", "Start · Tool Basics"];
  if (id <= 35) return ["track-foundations", "1 · Cloud Foundations"];
  if (id <= 37) return ["track-platform", "1 · Platform & Network"];
  if (id <= 42) return ["track-security", "2 · Cluster & Security"];
  if (id <= 46) return ["track-traffic", "3 · Traffic, DNS & TLS"];
  if (id <= 51) return ["track-observability", "4 · Observability"];
  if (id <= 57) return ["track-delivery", "5 · Data & Delivery"];
  return ["track-ops", "6 · Ops & Capstone"];
};

export default function ModulesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const filtered = useMemo(() => {
    return modules.filter((m) => {
      const okCat = cat === "All" || m.category === cat;
      const okQ =
        !q ||
        (m.title + m.tagline + m.id).toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [q, cat]);

  const groups = useMemo(() => {
    const order = [
      "track-basics",
      "track-foundations",
      "track-platform",
      "track-security",
      "track-traffic",
      "track-observability",
      "track-delivery",
      "track-ops",
    ];
    const map = new Map<string, typeof modules>();
    for (const m of filtered) {
      const [key] = trackOf(m.id);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return order.filter((k) => map.has(k)).map((k) => ({ key: k, items: map.get(k)! }));
  }, [filtered]);

  const trackTitle = (key: string) =>
    key === "track-basics" ? "Start · Tool Basics (20–29) — begin here"
    : key === "track-foundations" ? "1 · Cloud Foundations (30–35)"
    : key === "track-platform" ? "2 · Platform & Network (36–37)"
    : key === "track-security" ? "3 · Cluster & Security (38–42)"
    : key === "track-traffic" ? "4 · Traffic, DNS & TLS (43–46)"
    : key === "track-observability" ? "5 · Observability (47–51)"
    : key === "track-delivery" ? "6 · Data & Delivery (52–57)"
    : "7 · Ops & Capstone (58–67)";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight text-white">All labs · 20–67</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Start at lab 20 and go in order — tools, then cloud, then advanced. Every lab follows CONCEPT → WHY →
        ARCHITECTURE → BUILD → CONFIGURE → VERIFY → BREAK → DEBUG → FIX → PRODUCTION → INTERVIEW, and
        basics + foundations labs add a LINE-BY-LINE explainer for every command.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search labs… (e.g. prometheus, ingress, canary, 503)"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <p className="mt-3 font-mono text-xs text-zinc-500">
        {filtered.length} / {modules.length} labs shown
      </p>
      {groups.map((g) => (
        <section key={g.key} id={g.key} className="mt-10 scroll-mt-24">
          <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-black text-white">
            {trackTitle(g.key)}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {g.items.map((m) => (
              <ModuleCard key={m.slug} m={m} />
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <p className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center text-sm text-zinc-400">
          No labs match. Try “eks”, “alert”, “redis” or clear the filter.
        </p>
      )}
    </div>
  );
}
