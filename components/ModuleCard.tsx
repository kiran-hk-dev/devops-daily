import Link from "next/link";
import type { LabModule } from "@/lib/modules";
import { PipelineStrip } from "./ArchitectureDiagram";

export default function ModuleCard({ m }: { m: LabModule }) {
  return (
    <Link
      href={`/modules/${m.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-950/40"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
          #{m.id}
        </span>
        <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
          {m.category}
        </span>
        <span className="ml-auto font-mono text-[11px] text-zinc-500">
          {m.duration} · {m.level}
        </span>
      </div>
      <h3 className="text-[17px] font-bold leading-snug text-zinc-50 group-hover:text-emerald-300">
        {m.title}
      </h3>
      <p className="text-[13.5px] leading-relaxed text-zinc-400">{m.tagline}</p>
      <div className="mt-auto pt-1">
        <PipelineStrip steps={m.pipeline.slice(0, 5)} />
      </div>
      <span className="mt-2 text-[13px] font-bold text-emerald-400">
        Open lab →
      </span>
    </Link>
  );
}
