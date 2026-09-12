import Link from "next/link";
import { galleryDiagrams } from "@/lib/modules";
import { FlowDiagram } from "@/components/ArchitectureDiagram";

export default function ArchitecturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/modules/architecture-gallery" className="text-[13px] font-bold text-emerald-400 hover:text-emerald-300">
        ← Lab #65 theory
      </Link>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Architecture gallery</h1>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
        Lab #65 requirement: every major lesson gets a diagram answering — where does traffic go? what talks to
        what? which port? which security boundary? which AWS service owns it?
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {galleryDiagrams.map((g) => (
          <div key={g.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
            <h2 className="text-[17px] font-black text-white">{g.title}</h2>
            <div className="mt-3">
              <FlowDiagram
                nodes={g.nodes.map((n, i) => ({
                  label: n,
                  tone: (["blue", "green", "amber", "purple", "slate"] as const)[i % 5],
                }))}
                note={g.note}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
