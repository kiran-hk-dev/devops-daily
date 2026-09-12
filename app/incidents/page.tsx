"use client";

import { useState } from "react";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

type SimStep = {
  title: string;
  briefing: string;
  commands: { title: string; lang: string; code: string };
  evidence: string;
  question: string;
  options: string[];
  correct: number;
  explain: string;
};

const steps: SimStep[] = [
  {
    title: "1 · The page is down",
    briefing: "Pager: 'Production website returning 503 — revenue impact NOW.' You have only the URL: https://shop.mycompany.com/. Start like every incident: reproduce from outside.",
    commands: { title: "Reproduce", lang: "bash", code: "curl -I https://shop.mycompany.com/\ncurl -I https://shop.mycompany.com/healthz" },
    evidence: "Both return HTTP/1.1 503 Service Temporarily Unavailable. The edge is answering — but has no healthy backend.",
    question: "503 from the ALB with a response — what does that already rule out?",
    options: ["DNS is fully working (wrong — 503 proves resolution worked)", "DNS resolution worked; the failure is at/behind the LB", "The database is down"],
    correct: 1,
    explain: "You got an HTTP status from the ALB, so DNS → ALB succeeded. Move down: targets → ingress → service.",
  },
  {
    title: "2 · DNS + Route 53",
    briefing: "Confirm the first layer anyway — 30 seconds, never assumed.",
    commands: { title: "DNS proof", lang: "bash", code: "dig +short shop.mycompany.com\nnslookup shop.mycompany.com" },
    evidence: "Both return the ALB DNS name. Route 53 alias is correct.",
    question: "DNS resolves to the ALB. Next strict layer?",
    options: ["Restart all pods", "Target group health", "Rotate DB password"],
    correct: 1,
    explain: "Flow order: DNS ✓ → route/SG → LB → target group. Check target health before touching workloads.",
  },
  {
    title: "3 · ALB target group",
    briefing: "The ALB answers but has nobody to send to — classic.",
    commands: { title: "Target health", lang: "bash", code: "aws elbv2 describe-target-health --target-group-arn <tg-arn>\n# Result: all targets 'unhealthy — health checks failed'" },
    evidence: "Targets registered but health checks failing on /healthz. The pods may be fine — the check path/port may be wrong.",
    question: "All targets unhealthy on /healthz. What do you check next?",
    options: ["Ingress → Service → Endpoints → Pods, in order", "Delete the ALB", "Scale to 20 replicas"],
    correct: 0,
    explain: "Walk inward: ingress rules, service selector/ports, endpoints membership, then pod state + logs.",
  },
  {
    title: "4 · Ingress → Service → Endpoints",
    briefing: "Kubernetes side looks… fine. That's the trap.",
    commands: { title: "In-cluster chain", lang: "bash", code: "kubectl get ingress -n prod; kubectl describe ingress shop -n prod\nkubectl get svc,endpoints -n prod shop\nkubectl get pods -n prod -l app=shop   # Running!" },
    evidence: "Ingress routes to Service, Service has endpoints, pods are Running. Yet ALB says unhealthy. Running ≠ Ready — compare PORTS.",
    question: "Pods Running, endpoints exist, ALB unhealthy. Highest-value diff?",
    options: ["containerPort vs Service targetPort vs healthcheck port", "Node kernel version", "Grafana theme"],
    correct: 0,
    explain: "Port drift is the #1 'everything looks fine' 503. Check all three ports now.",
  },
  {
    title: "5 · The reveal",
    briefing: "Diff the deploy that went out 20 minutes ago — Prometheus shows the 5xx spike starts exactly there.",
    commands: { title: "Port diff", lang: "bash", code: "kubectl get pod -n prod <pod> -o jsonpath='{.spec.containers[0].ports}'  # containerPort 8080\nkubectl get svc -n prod shop -o jsonpath='{.spec.ports}'                    # targetPort 3000  <-- MISMATCH\nkubectl logs -n prod -l app=shop --tail=20   # app healthy… on :8080" },
    evidence: "Deploy changed containerPort 3000→8080 without updating Service targetPort (still 3000). Readiness/healthcheck hits a closed port → targets drain → 503.",
    question: "Root cause?",
    options: ["DNS outage", "containerPort/service targetPort drift after deploy", "RDS failover"],
    correct: 1,
    explain: "App healthy on the wrong port from the Service's view. Fix = align ports, roll forward, verify edge-to-app.",
  },
  {
    title: "6 · Fix + verify + prevent",
    briefing: "Fix forward (don't hand-edit prod blindly — apply the corrected manifest), then prove recovery at every layer.",
    commands: { title: "Recover", lang: "bash", code: "# fix service targetPort to 8080 (== containerPort == healthcheck port)\nkubectl apply -f shop-svc-fixed.yaml\nkubectl rollout status deployment/shop -n prod\ncurl -I https://shop.mycompany.com/   # 200\n# ALB targets Healthy, Prometheus 5xx → baseline, logs quiet" },
    evidence: "200s return, targets Healthy, SLOs green. Now document RCA + prevention so it never pages again.",
    question: "Best prevention?",
    options: ["CI/admission gate: probe port == containerPort == targetPort + ALB-healthy promotion", "Bigger nodes", "More dashboards"],
    correct: 0,
    explain: "Lab #64's lesson: encode port parity in CI/OPA and gate promotion on ALB health + deploy markers in Grafana.",
  },
];

export default function IncidentsPage() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const s = steps[step];
  const answered = picked !== null;
  const correctPick = answered && picked === s.correct;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    if (i === s.correct) setScore((x) => x + 1);
  };

  const next = () => {
    if (step === steps.length - 1) {
      setDone(true);
      return;
    }
    setStep((x) => x + 1);
    setPicked(null);
  };

  const restart = () => {
    setStep(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/modules/critical-incident-503" className="text-[13px] font-bold text-emerald-400 hover:text-emerald-300">
        ← Lab #64 briefing
      </Link>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
        Incident sim: <span className="text-red-400">production 503</span>
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        You start with only a URL and business impact. Score: <span className="font-mono font-bold text-emerald-300">{score}/{steps.length}</span>
      </p>

      {!done ? (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <span key={i} className={`h-2 w-8 rounded-full ${i < step ? "bg-emerald-500" : i === step ? "bg-amber-400" : "bg-zinc-800"}`} />
              ))}
            </div>
            <span className="ml-auto font-mono text-xs text-zinc-500">{step + 1}/{steps.length}</span>
          </div>
          <h2 className="mt-4 text-xl font-black text-white">{s.title}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-300">{s.briefing}</p>
          <div className="mt-4">
            <CodeBlock title={s.commands.title} lang={s.commands.lang} code={s.commands.code} />
          </div>
          <div className="mt-4 rounded-xl border border-sky-900 bg-sky-950/40 p-4">
            <p className="text-[13.5px] leading-relaxed text-sky-100">
              <span className="font-black">🔎 Evidence: </span>{s.evidence}
            </p>
          </div>
          <p className="mt-5 text-[14.5px] font-bold text-white">❓ {s.question}</p>
          <div className="mt-3 flex flex-col gap-2">
            {s.options.map((o, i) => {
              const isC = answered && i === s.correct;
              const isW = answered && i === picked && picked !== s.correct;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={`rounded-xl border px-4 py-3 text-left text-[13.5px] transition ${
                    isC ? "border-emerald-500 bg-emerald-950/60 text-emerald-100"
                    : isW ? "border-red-600 bg-red-950/50 text-red-100"
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-200 hover:border-zinc-500"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className={`mt-4 rounded-xl border p-4 text-[13.5px] leading-relaxed ${correctPick ? "border-emerald-800 bg-emerald-950/40 text-emerald-100" : "border-red-900 bg-red-950/40 text-red-100"}`}>
              <span className="font-black">{correctPick ? "✓ Correct. " : "✕ Not quite. "}</span>
              {s.explain}
            </div>
          )}
          <button
            onClick={next}
            disabled={!answered}
            className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-extrabold text-zinc-950 disabled:opacity-30 hover:bg-emerald-400"
          >
            {step === steps.length - 1 ? "Finish incident →" : "Next layer →"}
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center sm:p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Incident closed</p>
          <p className="mt-2 text-4xl font-black text-white">{score}/{steps.length}</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            {score === steps.length
              ? "Perfect triage. Root cause: containerPort/targetPort drift. Write the RCA: cause → resolution → CI port-parity gate + ALB-healthy promotion."
              : "Review the full chain in Lab #64, then re-run. On-call grades on evidence order, not speed."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-emerald-400">
              Run it again
            </button>
            <Link href="/modules/critical-incident-503" className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-100">
              Read lab #64
            </Link>
            <Link href="/troubleshooting" className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-100">
              Triage flow
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
