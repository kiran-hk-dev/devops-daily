import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevOps Daily — Tasks & Issues of a DevOps Engineer",
  description:
    "Daily tasks and issues of a DevOps engineer, hands-on: Linux, Git, Jenkins, Kubernetes, Helm, Terraform, webhooks, agentic AI, AWS, Docker, EKS, networking, security, ingress, TLS, observability, delivery, incidents. Labs 20–67.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 bg-zinc-950">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">DevOps Daily</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Daily tasks and issues of a DevOps engineer. Every lesson: build → verify → break → debug → fix → prevent.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Practice loop</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Build · Deploy · Monitor · Break · Investigate · Fix · Secure · Automate · Scale · Rollback ·
                Document · Prevent
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Golden rule</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Never static AWS keys in Git, YAML, images or Jenkins. Pods assume IAM roles via STS.
              </p>
            </div>
          </div>
          <p className="border-t border-zinc-900 py-4 text-center font-mono text-[11px] text-zinc-600">
            Labs 20–67 · ap-south-1 · VPC 10.0.0.0/16 · Built for on-call engineers
          </p>
        </footer>
      </body>
    </html>
  );
}
