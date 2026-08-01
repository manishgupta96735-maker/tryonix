import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, Check, ChevronDown, Download, Lock, Loader2, RefreshCw, ScanFace,
  Shirt, Sparkles, UploadCloud, UserRound, Wand2, Zap, Twitter, Instagram, MessageCircle,
} from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";
import demoPerson from "@/assets/demo-person.jpg";
import demoResult from "@/assets/demo-result.jpg";

const mascot = mascotAsset.url;

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TryOnix — Try Clothes Before Buying with AI" },
      { name: "description", content: "Upload your photo and any outfit. TryOnix creates a realistic AI try-on in under 10 seconds. No account required, 3 free generations." },
      { property: "og:title", content: "TryOnix — Try Clothes Before Buying" },
      { property: "og:description", content: "Realistic AI virtual try-on in under 10 seconds. No account required." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TryOnix — Try Clothes Before Buying" },
      { name: "twitter:description", content: "Realistic AI virtual try-on in under 10 seconds. No account required." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <UploadSection />
        <Steps />
        <Comparison />
        <Benefits />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

/* ── Section 1 · Navbar ────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#how", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img src={mascot} alt="" className="size-8 shrink-0 rounded-xl object-cover" />
          <span className="text-[19px] font-bold tracking-tight">TryOnix</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-[15px] text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">{l.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/auth" className="hidden rounded-full px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Sign In
          </Link>
          <Link to="/" className="btn-glow rounded-full bg-primary px-5 py-2.5 text-[15px] font-semibold text-primary-foreground">
            Start Free
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-border p-2 md:hidden"
          >
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {[...links, { href: "/auth", label: "Sign In" }].map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="py-3 text-[15px] text-muted-foreground">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Section 2 · Hero ──────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="float-blob pointer-events-none absolute -right-40 -top-40 size-[620px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 22%, transparent), transparent 70%)" }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            <Sparkles className="size-3.5" /> AI Virtual Try-On
          </span>
          <h1 className="mt-6 text-[clamp(2.6rem,6.4vw,4.4rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            Try Clothes
            <br />
            <span className="text-primary">Before Buying</span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
            Upload your photo. Upload any outfit.
            <br className="hidden sm:block" /> Get realistic AI try-on in under 10 seconds.
          </p>
          <div className="mt-9">
            <a href="#upload" className="btn-glow inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground">
              <UploadCloud className="size-5" /> Upload Photo
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground">
            {["No account required", "3 Free Generations"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-4 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="fade-up-2 flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-[292px] rounded-[46px] border border-border bg-foreground p-2.5 shadow-[var(--shadow-lift)] sm:w-[320px]">
      <div className="relative overflow-hidden rounded-[38px] bg-card">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground" />
        <div className="relative">
          <img src={demoPerson} alt="Before try-on" className="aspect-[3/4] w-full object-cover" loading="eager" />
          <span className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold shadow-sm">Before</span>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-card shadow-md">
            <ArrowDown className="size-5 text-primary" />
          </div>
          <img src={demoResult} alt="After AI try-on result" className="aspect-[3/4] w-full object-cover" loading="lazy" />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">After</span>
        </div>
      </div>
    </div>
  );
}

/* ── Section 3 · Try-On Studio (inline, no separate page) ── */
const GUEST_KEY = "tryonix_guest_credits_v1";
const FREE_TRIES = 3;

function readGuestCredits() {
  if (typeof window === "undefined") return FREE_TRIES;
  const v = window.localStorage.getItem(GUEST_KEY);
  if (v === null) {
    window.localStorage.setItem(GUEST_KEY, String(FREE_TRIES));
    return FREE_TRIES;
  }
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : FREE_TRIES;
}

function UploadSection() {
  const [person, setPerson] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(FREE_TRIES);

  useEffect(() => { setCredits(readGuestCredits()); }, []);

  const outOfCredits = credits <= 0;

  const generate = async () => {
    if (!person || !outfit || loading || outOfCredits) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personImage: person, clothImage: outfit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed. Please try again.");
      setResult(data.image);
      const next = Math.max(0, credits - 1);
      window.localStorage.setItem(GUEST_KEY, String(next));
      setCredits(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="mx-auto max-w-5xl scroll-mt-24 px-5 pb-10 sm:px-8">
      <div className="rounded-[24px] border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">Try it right here</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-[13px] font-semibold">
            <Zap className="size-3.5 text-primary" />
            {credits} free {credits === 1 ? "try-on" : "try-ons"} left
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <PickCard label="Upload Your Photo" hint="Clear full-body photo works best" icon={UserRound} value={person} onChange={setPerson} />
          <PickCard label="Upload Your Outfit" hint="Any clothing product image" icon={Shirt} value={outfit} onChange={setOutfit} />
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={!person || !outfit || loading || outOfCredits}
          className="btn-glow mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground disabled:opacity-40"
        >
          {loading ? <><Loader2 className="size-5 animate-spin" /> Creating your try-on…</> : <><Wand2 className="size-5" /> Start Your Try-On</>}
        </button>

        {!person || !outfit ? (
          <p className="mt-3 text-center text-[13px] text-muted-foreground">
            Add both photos to start — no sign-up needed for your first {FREE_TRIES}.
          </p>
        ) : null}

        {outOfCredits && (
          <div className="mt-5 rounded-[20px] border border-border bg-secondary/50 p-5 text-center">
            <p className="text-[15px] font-bold">Your {FREE_TRIES} free try-ons are used</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Go Premium for $9/month — 85 try-ons every month, no daily limit. Use them all in one day if you want.
            </p>
            <a href="#pricing" className="btn-glow mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-primary-foreground">
              Get Premium — $9/month
            </a>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-[20px] border border-destructive/30 bg-destructive/5 p-5 text-center">
            <p className="text-sm font-semibold text-destructive">{error}</p>
            <button type="button" onClick={generate} className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold">
              <RefreshCw className="size-4" /> Retry
            </button>
          </div>
        )}

        {(loading || result) && (
          <div className="mt-7">
            <h3 className="text-[15px] font-bold">Your result</h3>
            <div className="relative mt-3 grid aspect-[4/5] max-h-[540px] w-full place-items-center overflow-hidden rounded-[20px] border border-border bg-secondary/50">
              {loading && (
                <div className="text-center">
                  <Loader2 className="mx-auto size-8 animate-spin text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">AI is fitting your outfit…</p>
                </div>
              )}
              {result && !loading && <img src={result} alt="AI try-on result" className="size-full object-contain" />}
            </div>
            {result && !loading && (
              <a
                href={result}
                download={`tryonix-${Date.now()}.png`}
                className="mt-4 flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 text-[15px] font-semibold hover-lift"
              >
                <Download className="size-4 text-primary" /> Download Image
              </a>
            )}
          </div>
        )}
      </div>

      <ol className="mt-8 flex flex-wrap items-start justify-center gap-x-2 gap-y-6 sm:gap-x-4">
        {[
          { icon: UserRound, label: "Upload Photo" },
          { icon: Shirt, label: "Upload Outfit" },
          { icon: Wand2, label: "Start Try-On" },
          { icon: Download, label: "Download" },
        ].map((s, i, arr) => (
          <li key={s.label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex w-[86px] flex-col items-center gap-2.5 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-primary-soft">
                <s.icon className="size-6 text-primary" />
              </span>
              <span className="text-[13px] font-semibold leading-tight">{s.label}</span>
            </div>
            {i < arr.length - 1 && <span aria-hidden className="mt-[-18px] text-border">›</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function PickCard({
  label, hint, icon: Icon, value, onChange,
}: {
  label: string;
  hint: string;
  icon: typeof UserRound;
  value: string | null;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const read = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(file);
  };
  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); read(e.dataTransfer.files?.[0]); }}
        className="relative flex aspect-[5/4] w-full items-center justify-center overflow-hidden rounded-[20px] border-2 border-dashed border-border bg-secondary/40 px-6 text-center transition-colors hover:border-primary"
      >
        {value ? (
          <img src={value} alt={label} className="size-full object-cover" />
        ) : (
          <span className="block">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft">
              <Icon className="size-6 text-primary" />
            </span>
            <span className="mt-3 block text-[15px] font-bold">{label}</span>
            <span className="mt-1 block text-[13px] text-muted-foreground">{hint}</span>
          </span>
        )}
        <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={(e) => read(e.target.files?.[0])} />
      </button>
      <p className="mt-2 text-center text-sm font-semibold">{value ? `${label} ✓` : label}</p>
    </div>
  );
}


/* ── Section 4 · 3 Easy Steps ──────────────────────── */
function Steps() {
  const steps = [
    { icon: UserRound, title: "Upload Photo", text: "Add a clear full-body photo of yourself." },
    { icon: Shirt, title: "Upload Outfit", text: "Drop in any outfit you want to try on." },
    { icon: Wand2, title: "Generate", text: "AI creates a realistic try-on in seconds." },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHeading title="3 Easy Steps" subtitle="No tutorials. No settings. Just three taps." />
      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {steps.map((s, i) => (
          <article key={s.title} className="hover-lift relative rounded-[24px] border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
            <span className="absolute left-6 top-6 grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary-soft">
              <s.icon className="size-7 text-primary" />
            </span>
            <h3 className="mt-6 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Section 5 · Before/After slider ───────────────── */
function Comparison() {
  const [pos, setPos] = useState(50);
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <SectionHeading title="Realistic AI results" subtitle="Drag the slider to compare before and after." />
      <div className="relative mt-12 select-none overflow-hidden rounded-[24px] border border-border shadow-[var(--shadow-lift)]">
        <img src={demoResult} alt="After AI try-on" className="aspect-[16/10] w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={demoPerson} alt="Before try-on" className="aspect-[16/10] h-full w-full object-cover" style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }} loading="lazy" />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold shadow-sm">Before</span>
        <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">After</span>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-card" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card text-xs font-bold shadow-md">‹ ›</span>
        </div>
        <input
          type="range"
          min={2}
          max={98}
          value={pos}
          aria-label="Compare before and after"
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </section>
  );
}

/* ── Section 6 · Benefits ──────────────────────────── */
function Benefits() {
  const items = [
    { icon: ScanFace, title: "Looks Like You", text: "Keeps your face, body & pose." },
    { icon: Sparkles, title: "HD Quality", text: "High resolution, realistic detail." },
    { icon: Zap, title: "Fast Generation", text: "Results in under 10 seconds." },
    { icon: Lock, title: "Private & Secure", text: "Your photos are never shared." },
    { icon: Check, title: "No Signup", text: "Start instantly, no account." },
  ];
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading title="Why TryOnix?" subtitle="Everything you need. Nothing you don't." />
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((b) => (
            <div key={b.title} className="hover-lift rounded-[20px] border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <b.icon className="mx-auto size-6 text-primary" />
              <h3 className="mt-4 text-[15px] font-bold">{b.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 7 · Pricing ───────────────────────────── */
function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHeading title="Simple Pricing" subtitle="First 3 try-ons free, no account. Create an account only when you go Premium." />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="hover-lift rounded-[24px] border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-bold">Free</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try it out instantly</p>
          <p className="mt-6 text-5xl font-extrabold tracking-tight">$0</p>
          <ul className="mt-7 space-y-3 text-sm">
            {["3 try-ons", "No sign-up needed", "Download your results"].map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <Check className="size-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <a href="#upload" className="mt-8 block rounded-full border border-border py-3.5 text-center text-[15px] font-semibold transition-colors hover:bg-secondary">
            Start Free
          </a>
        </div>

        <div className="hover-lift relative rounded-[24px] bg-primary p-8 text-primary-foreground shadow-[var(--shadow-lift)]">
          <span className="absolute right-6 top-7 rounded-full bg-primary-foreground/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
            Popular
          </span>
          <h3 className="text-lg font-bold">Premium</h3>
          <p className="mt-1 text-sm opacity-80">85 try-ons every month</p>
          <p className="mt-6 text-5xl font-extrabold tracking-tight">
            $9<span className="text-base font-semibold opacity-80"> /month</span>
          </p>
          <ul className="mt-7 space-y-3 text-sm">
            {["85 try-ons per month", "No daily limit — use them any day", "HD downloads, no watermark", "Saved history of every result", "Priority generation queue"].map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <Check className="size-4" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/auth" className="mt-8 block rounded-full bg-primary-foreground py-3.5 text-center text-[15px] font-semibold text-primary transition-transform hover:scale-[1.02]">
            Get Premium
          </Link>
          <p className="mt-3 text-center text-[12px] opacity-80">Account (username + password) is created at checkout.</p>
        </div>
      </div>
    </section>
  );
}

/* ── Section 8 · FAQ ───────────────────────────────── */
function Faq() {
  const faqs = [
    { q: "How does it work?", a: "Upload a photo of yourself and a photo of any outfit. Our AI renders you wearing it, keeping your face, body and pose intact." },
    { q: "Is my data safe?", a: "Yes. Your photos are used only to generate your result and are never shared or sold. You can delete results anytime." },
    { q: "How long does it take?", a: "Most try-ons finish in under 10 seconds. Pro accounts use a priority queue for the fastest results." },
    { q: "Can I download images?", a: "Absolutely. Every result can be downloaded — Pro downloads are HD and watermark-free." },
    { q: "What clothes work best?", a: "Clear, front-facing product photos on a plain background give the most realistic results — tops, dresses, jackets and full outfits all work." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 pb-28 sm:px-8">
      <SectionHeading title="Frequently Asked Questions" />
      <div className="mt-12 divide-y divide-border overflow-hidden rounded-[24px] border border-border bg-card shadow-[var(--shadow-soft)]">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px] font-semibold">
              {f.q}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ── Section 9 · Footer ────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={mascot} alt="" className="size-8 rounded-xl object-cover" />
            <span className="text-[17px] font-bold tracking-tight">TryOnix</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            AI virtual try-on for shoppers, creators, and modern storefronts.
          </p>
        </div>

        <nav className="text-sm">
          <h2 className="font-semibold">Company</h2>
          <ul className="mt-4 space-y-2.5 text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="font-semibold">Follow us</h2>
          <div className="mt-4 flex items-center gap-3">
            {[
              { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
              { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
              { Icon: MessageCircle, label: "Discord", href: "https://discord.com" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer noopener"
                className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} TryOnix. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-extrabold tracking-[-0.03em]">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
