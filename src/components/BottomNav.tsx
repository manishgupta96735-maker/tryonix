import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";

const navLinks = [
  { to: "/app", label: "Try-On" },
  { to: "/history", label: "History" },
  { to: "/settings", label: "Settings" },
] as const;

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={mascotAsset.url} alt="TryOnix" className="size-9 rounded-full object-cover" />
          <span className="text-xl font-bold tracking-tight text-foreground">TryOnix</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:hidden">
          {navLinks.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-primary-soft text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export function BrandHeader({ title }: { title?: string }) {
  return (
    <div className="flex items-center gap-2 px-1 pb-2">
      <img src={mascotAsset.url} alt="TryOnix" className="size-8 rounded-full object-cover" />
      <div className="text-lg font-bold text-foreground">{title ?? "TryOnix"}</div>
    </div>
  );
}

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="border-t border-border mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={mascotAsset.url} alt="TryOnix" className="size-5 rounded-full object-cover" />
            <span>© {new Date().getFullYear()} TryOnix</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { Sparkles };
