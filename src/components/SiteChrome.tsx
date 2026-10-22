import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Shirt, Sparkles, X, Zap } from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { Button } from "@/components/ui/button";

const guestKey = "tryonix_guest_credits_v1";
const navigation = [
  { label: "Home", to: "/" as const },
  { label: "How it works", to: "/how-it-works" as const },
  { label: "Examples", to: "/examples" as const },
  { label: "FAQ", to: "/faq" as const },
];

export function useGuestCredits() {
  const [credits, setCredits] = useState(3);

  useEffect(() => {
    const update = () => setCredits(readCredits());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("tryonix-credits-change", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("tryonix-credits-change", update);
    };
  }, []);

  return credits;
}

function readCredits() {
  try {
    const raw = window.localStorage.getItem(guestKey);
    if (raw === null) return 3;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.max(0, n) : 3;
  } catch {
    return 3;
  }
}

export function SiteHeader() {
  const credits = useGuestCredits();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="TryOnix home">
          <img src={mascotAsset.url} alt="" className="size-9 rounded-xl object-cover" />
          <span className="text-lg font-extrabold text-brand-navy">TryOnix</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-brand-pink-soft hover:text-brand-navy">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-brand-pink/20 bg-brand-pink-soft px-3 text-xs font-bold text-brand-navy sm:px-3.5 sm:text-sm">
            <Zap className="size-3.5 shrink-0 text-brand-pink" aria-hidden="true" />
            <span className="hidden sm:inline">{credits} free {credits === 1 ? "try-on" : "try-ons"} left</span>
            <span className="sm:hidden">{credits} left</span>
          </div>
          <Button asChild className="brand-gradient hidden min-h-10 rounded-full px-4 text-white shadow-sm sm:inline-flex">
            <Link to="/" hash="upload">Try now <Sparkles className="size-4" /></Link>
          </Button>
          <Button variant="outline" size="icon" className="size-10 rounded-full md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-6xl gap-1">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-foreground hover:bg-brand-pink-soft">
                {item.label}
              </Link>
            ))}
            <Link to="/" hash="upload" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-brand-pink">
              <Shirt className="size-4" /> Try it now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img src={mascotAsset.url} alt="" className="size-8 rounded-lg object-cover" />
            <span className="font-extrabold text-brand-navy">TryOnix</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Your style, your way.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-brand-pink">Home</Link>
          <Link to="/how-it-works" className="hover:text-brand-pink">How it works</Link>
          <Link to="/examples" className="hover:text-brand-pink">Examples</Link>
          <Link to="/faq" className="hover:text-brand-pink">FAQ</Link>
        </nav>
        <nav aria-label="Legal links" className="flex gap-5 text-sm font-medium text-muted-foreground">
          <Link to="/privacy" className="hover:text-brand-pink">Privacy</Link>
          <Link to="/terms" className="hover:text-brand-pink">Terms</Link>
        </nav>
      </div>
      <div className="border-t border-border px-5 py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} TryOnix</div>
    </footer>
  );
}

export function PublicPage({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}

export function PageIntro({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-12 text-center sm:px-6 sm:pt-16">
      {eyebrow && <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-pink/20 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-pink"><Sparkles className="size-3.5" />{eyebrow}</p>}
      <h1 className="text-4xl font-extrabold leading-tight text-brand-navy sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{subtitle}</p>
    </div>
  );
}

export function TitleSparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 1.5c.7 5.5 4.9 9.7 10.5 10.5-5.5.7-9.7 4.9-10.5 10.5C11.3 17 7.1 12.8 1.5 12 7.1 11.2 11.3 7 12 1.5Z" />
    </svg>
  );
}

export function PlayfulBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-14 -top-8 size-40 rounded-full bg-brand-lavender/25 sm:size-52" />
      <div className="absolute -right-16 top-24 size-44 rounded-full bg-brand-peach/40 sm:size-56" />
      <div className="absolute -left-10 bottom-10 size-36 rounded-full bg-brand-peach/35 sm:size-44" />
      <div className="absolute -right-10 -bottom-12 size-40 rounded-full bg-brand-pink/10 sm:size-52" />
      <div className="absolute left-[8%] top-40 hidden lg:block">
        <svg viewBox="0 0 40 24" fill="none" className="size-10 text-[#ffc93c]" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M4 20C10 14 14 8 20 4M22 14c4-3 8-6 13-8" />
        </svg>
      </div>
      <div className="absolute right-[7%] top-56 hidden lg:block">
        <svg viewBox="0 0 40 24" fill="none" className="size-10 text-brand-coral" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M4 4c5 4 9 10 12 16M24 6c4 4 7 9 9 14" />
        </svg>
      </div>
      <div className="absolute bottom-24 left-[5%] hidden lg:block">
        <TitleSparkle className="size-8 text-brand-coral/70" />
      </div>
      <div className="absolute bottom-32 right-[6%] hidden lg:block">
        <TitleSparkle className="size-6 text-brand-pink/60" />
      </div>
    </div>
  );
}