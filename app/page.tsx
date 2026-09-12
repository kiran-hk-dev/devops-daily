import Link from "next/link";
import { modules } from "@/lib/modules";
import ModuleCard from "@/components/ModuleCard";
import { FlowDiagram } from "@/components/ArchitectureDiagram";

const heroFlow = [
  { label: "Developer", detail: "git push", tone: "slate" as const },
  { label: "GitHub → Jenkins → Docker → ECR", detail: "test · build :sha · push", tone: "blue" as const },
  { label: "Amazon EKS + LB Controller", detail: "rollout, readiness-gated", tone: "green" as const },
  { label: "ALB :443 → Route 53 → ACM HTTPS", detail: "mycompany.com", tone: "amber" as const },
  { label: "Prometheus → Grafana → Alertmanager  ·  Fluent Bit → CloudWatch/Loki", tone: "purple" as const },
];

const loops = [
  "Build", "Deploy", "Monitor", "Break", "Investigate", "Fix",
  "Secure", "Automate", "Scale", "Rollback", "Document", "Prevent",
];

const tracks = [
  { title: "Start · Tool Basics", desc: "Labs 20–25. Linux, Git, Jenkins, Kubernetes, Helm, Terraform — each tool explained line by line.", href: "/modules#track-basics" },
  { title: "1 · Cloud Foundations", desc: "Labs 30–35. AWS account, access keys, VPC + EC2, Docker setup, build & push images — every line explained.", href: "/modules#track-foundations" },
  { title: "2 · Platform & Network", desc: "Labs 36–37. The map + VPC 10.0.0.0/16, subnets, IGW/NAT, pod vs service networking.", href: "/modules#track-platform" },
  { title: "3 · Cluster & Security", desc: "Labs 38–42. eksctl, IAM/RBAC, Pod Identity, SGs, NetworkPolicy zero-trust.", href: "/modules#track-security" },
  { title: "4 · Traffic, DNS & TLS", desc: "Labs 43–46. ALB controller, Ingress, Route 53 aliases, ACM HTTPS.", href: "/modules#track-traffic" },
  { title: "5 · Observability", desc: "Labs 47–51. Prometheus, PromQL, Grafana, Alertmanager, CloudWatch/Loki.", href: "/modules#track-observability" },
  { title: "6 · Data & Delivery", desc: "Labs 52–57. Secrets, RDS, Redis, zero-downtime, blue/green, canary.", href: "/modules#track-delivery" },
  { title: "7 · Ops & Capstone", desc: "Labs 58–67. Break/fix, triage flow, cost, DR, e-commerce build, 503 sim.", href: "/modules#track-ops" },
];

export default function Home() {
  const featured = modules.slice(0, 6);
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-zinc-800 bg-gradient-to-b from-emerald-950/40 via-zinc-950 to-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Prod is yours · shift starting
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
              Daily Tasks and Issues{" "}
              <span className="text-emerald-400">of a DevOps Engineer.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400">
              A complete, hands-on journey through a DevOps engineer's real work — from{" "}
              <span className="text-zinc-200">AWS account, EC2 and Docker</span> to{" "}
              <span className="text-zinc-200">HTTPS on your own domain</span>, with monitoring, logging, security,
              delivery strategies, cost, DR and full incident simulations. Command-first: no lecture without a lab.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/modules"
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-zinc-950 transition hover:bg-emerald-400"
              >
                Start lab #20 →
              </Link>
              <Link
                href="/incidents"
                className="rounded-xl border border-red-800 bg-red-950/50 px-5 py-3 text-sm font-extrabold text-red-200 transition hover:border-red-600"
              >
                ◉ 503 incident sim
              </Link>
              <Link
                href="/checklist"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-200 transition hover:border-zinc-500"
              >
                Go-live checklist
              </Link>
            </div>
            <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["44", "hands-on labs"],
                ["12", "arch diagrams"],
                ["11-step", "triage flow"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-center">
                  <p className="text-2xl font-black text-white">{n}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <FlowDiagram nodes={heroFlow} note="Left chain carries user traffic. Monitoring, logging and security wrap every hop — check each lab's diagram for ports and trust boundaries." />
        </div>
        <div className="border-t border-zinc-900 bg-zinc-950/70">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-3">
            {loops.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {l}
                </span>
                {i < loops.length - 1 && <span className="text-[10px] text-zinc-700">●</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-black tracking-tight text-white">Six tracks. One production system.</h2>
        <p className="mt-1 text-sm text-zinc-400">Follow in order — each track assumes the previous one is healthy.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-emerald-600"
            >
              <p className="text-[15px] font-extrabold text-white">{t.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-400">{t.desc}</p>
              <p className="mt-3 text-[13px] font-bold text-emerald-400">View →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-y border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black tracking-tight text-white">Start here</h2>
            <Link href="/modules" className="text-sm font-bold text-emerald-400 hover:text-emerald-300">
              All 32 labs →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((m) => (
              <ModuleCard key={m.slug} m={m} />
            ))}
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-black tracking-tight text-white">Command-first. Every lab.</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["CONCEPT + WHY", "What it is, why companies pay for it. Two blocks, then hands on keys."],
            ["ARCHITECTURE", "Diagram first: where traffic goes, which port, which boundary, who owns it."],
            ["BUILD → VERIFY", "Real commands + YAML. Verification output is the definition of done."],
            ["BREAK → FIX", "Intentional failure, evidence-driven debug, fix, verify again, prevent."],
          ].map(([h, d]) => (
            <div key={h} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="font-mono text-xs font-black tracking-widest text-emerald-400">{h}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-400">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/troubleshooting" className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-100 hover:border-emerald-600">
            Open the 11-step triage flow →
          </Link>
          <Link href="/architectures" className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-100 hover:border-emerald-600">
            Browse 12 architecture diagrams →
          </Link>
        </div>
      </section>
    </div>
  );
}
