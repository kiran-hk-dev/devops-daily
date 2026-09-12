import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Labs 20–67" },
  { href: "/architectures", label: "Diagrams" },
  { href: "/troubleshooting", label: "Triage Flow" },
  { href: "/incidents", label: "Incident Sim" },
  { href: "/checklist", label: "Checklist" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-mono text-lg font-black text-zinc-950">
            ◆
          </span>
          <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight text-zinc-50">
                DevOps Daily
              </span>
              <span className="block font-mono text-[10.5px] uppercase tracking-widest text-emerald-400">
                tasks & issues · labs 20–67
              </span>
          </span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[13px] font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-zinc-900 bg-zinc-950">
        <p className="mx-auto max-w-6xl px-4 py-1.5 text-center font-mono text-[11px] tracking-wide text-zinc-500">
          YOU ARE RESPONSIBLE FOR KEEPING PRODUCTION HEALTHY — build · deploy · monitor · break · fix · prevent
        </p>
      </div>
    </header>
  );
}
