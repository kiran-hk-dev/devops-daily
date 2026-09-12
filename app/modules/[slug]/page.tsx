import Link from "next/link";
import { notFound } from "next/navigation";
import { modules, getModule } from "@/lib/modules";
import CodeBlock from "@/components/CodeBlock";
import LineByLine from "@/components/LineByLine";
import { FlowDiagram, PipelineStrip } from "@/components/ArchitectureDiagram";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

function Section({
  kicker,
  title,
  children,
  accent,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
      <p className={`font-mono text-[11px] font-black uppercase tracking-[0.2em] ${accent ?? "text-emerald-400"}`}>
        {kicker}
      </p>
      <h2 className="mt-1 text-xl font-black tracking-tight text-white">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) notFound();
  const idx = modules.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? modules[idx - 1] : null;
  const next = idx < modules.length - 1 ? modules[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/modules" className="text-[13px] font-bold text-emerald-400 hover:text-emerald-300">
        ← All labs
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-bold text-emerald-300">
          LAB #{m.id}
        </span>
        <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300">{m.category}</span>
        <span className="font-mono text-xs text-zinc-500">{m.duration} · {m.level}</span>
      </div>
      <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">{m.title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{m.tagline}</p>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <PipelineStrip steps={m.pipeline} />
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <Section kicker="Concept" title="What is it?">
          <p className="text-[14.5px] leading-relaxed text-zinc-300">{m.concept}</p>
        </Section>

        <Section kicker="Why" title="Why do companies use it?">
          <ul className="flex flex-col gap-2">
            {m.why.map((w, i) => (
              <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-zinc-300">
                <span className="mt-0.5 font-black text-emerald-400">▸</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section kicker="Architecture" title="Where does traffic go?">
          <FlowDiagram nodes={m.architectureNodes} note={m.architectureNote} />
        </Section>

        <Section kicker="Build" title="Run the commands">
          {m.build.map((b, i) => (
            <CodeBlock key={i} title={b.title} lang={b.lang} code={b.code} />
          ))}
        </Section>

        <Section kicker="Configure" title="YAML / Terraform / config">
          {m.configure.map((b, i) => (
            <CodeBlock key={i} title={b.title} lang={b.lang} code={b.code} />
          ))}
        </Section>

        <Section kicker="Verify" title="Prove it works">
          {m.verify.map((b, i) => (
            <CodeBlock key={i} title={b.title} lang={b.lang} code={b.code} />
          ))}
        </Section>

        {m.lineByLine && m.lineByLine.length > 0 && (
          <Section kicker="Line by line" title="Every line, explained" accent="text-amber-300">
            <LineByLine steps={m.lineByLine} />
          </Section>
        )}

        <Section kicker="Break" title="Intentional failure" accent="text-red-400">
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4">
            <p className="text-[14.5px] leading-relaxed text-red-100">
              <span className="font-black">⚠ BREAK IT: </span>
              {m.breakIt}
            </p>
          </div>
        </Section>

        <Section kicker="Debug" title="Investigate with evidence" accent="text-amber-300">
          {m.debug.map((b, i) => (
            <CodeBlock key={i} title={b.title} lang={b.lang} code={b.code} />
          ))}
        </Section>

        <Section kicker="Fix" title="Apply the solution">
          {m.fix.map((b, i) => (
            <CodeBlock key={i} title={b.title} lang={b.lang} code={b.code} />
          ))}
        </Section>

        <Section kicker="Production" title="How this looks in a real company" accent="text-violet-300">
          <ul className="flex flex-col gap-2">
            {m.production.map((w, i) => (
              <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-zinc-300">
                <span className="mt-0.5 font-black text-violet-300">▸</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section kicker="Interview" title="Answer like the on-call owner" accent="text-sky-300">
          {m.interview.map((qa, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-[14px] font-bold text-white">Q: {qa.q}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-300">A: {qa.a}</p>
            </div>
          ))}
        </Section>
      </div>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/modules/${prev.slug}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-emerald-600">
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">← Previous · #{prev.id}</p>
            <p className="mt-1 text-sm font-bold text-zinc-100">{prev.title}</p>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/modules/${next.slug}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-right transition hover:border-emerald-600">
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Next · #{next.id} →</p>
            <p className="mt-1 text-sm font-bold text-zinc-100">{next.title}</p>
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}
