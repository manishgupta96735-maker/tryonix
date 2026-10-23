import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Download, Heart, Loader2, RefreshCw, ShieldCheck, Shirt, Sparkles, Star,
  Upload, UserRound, Wand2, X, Zap,
} from "lucide-react";
import { PublicPage } from "@/components/SiteChrome";
import { readTryOnDraft, saveTryOnDraft, saveTryOnRecord } from "@/lib/tryon-storage";
import demoPerson from "@/assets/demo-person.jpg";
import demoOutfit from "@/assets/demo-outfit.jpg";
import demoResult from "@/assets/demo-result.jpg";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TryOnix — See Any Outfit On Yourself" },
      { name: "description", content: "Upload your photo and outfit, and see how you look in it instantly. Try new styles, shop smarter, and find your perfect look. First 3 try-ons free, no sign-up." },
      { property: "og:title", content: "TryOnix — See Any Outfit On Yourself" },
      { property: "og:description", content: "Upload your photo and outfit, and see how you look in it instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "TryOnix — See Any Outfit On Yourself" },
      { name: "twitter:description", content: "Upload your photo and outfit, and see how you look in it instantly." },
    ],
  }),
  component: LandingPage,
});

/* ── Page ──────────────────────────────────────────── */
function LandingPage() {
  return (
    <PublicPage>
      <Hero />
      <UploadSection />
      <Benefits />
    </PublicPage>
  );
}

/* ── Hero ──────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="float-blob pointer-events-none absolute -left-32 top-10 size-[420px] rounded-full bg-brand-lavender-soft blur-3xl"
      />
      <div
        aria-hidden
        className="float-blob pointer-events-none absolute -right-32 top-40 size-[420px] rounded-full bg-brand-peach/60 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-8 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="fade-up text-center lg:text-left">
          <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-brand-navy">
            See Any Outfit
            <br />
            <span className="text-gradient">On Yourself</span>
            <Sparkles className="ml-2 inline size-8 text-brand-coral" aria-hidden />
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground lg:mx-0">
            Upload your photo and outfit, and see how you look in it instantly.
            Try new styles, shop smarter, and find your perfect look.
          </p>
        </div>
        <HeroCollage />
      </div>
    </section>
  );
}

function HeroCollage() {
  return (
    <div className="fade-up-2 relative mx-auto w-full max-w-lg pb-4">
      <span aria-hidden className="absolute -left-2 top-0 text-2xl text-brand-coral">✦</span>
      <span aria-hidden className="absolute -right-1 top-10 text-xl text-brand-lavender">✦</span>
      <span aria-hidden className="absolute bottom-6 left-4 text-xl text-brand-pink">♡</span>
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        <Polaroid img={demoPerson} alt="Example person photo" caption="Your Photo" className="-rotate-6 w-28 sm:w-36" />
        <Polaroid img={demoOutfit} alt="Example outfit photo" caption="Outfit" className="w-28 rotate-3 sm:w-36" />
        <Polaroid img={demoResult} alt="Example AI try-on result" caption="AI Try-On" badge className="w-32 rotate-2 sm:w-44" />
      </div>
    </div>
  );
}

function Polaroid({
  img, alt, caption, className = "", badge = false,
}: { img: string; alt: string; caption: string; className?: string; badge?: boolean }) {
  return (
    <figure className={`relative rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-lift)] ${className}`}>
      <img src={img} alt={alt} className="aspect-[3/4] w-full rounded-xl object-cover" loading="eager" />
      <figcaption className="pb-1 pt-1.5 text-center text-[11px] font-bold text-brand-navy sm:text-xs">{caption}</figcaption>
      {badge && (
        <span className="brand-gradient absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          ✦ AI Try-On
        </span>
      )}
    </figure>
  );
}

/* ── Try-On Studio ─────────────────────────────────── */
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
  const navigate = useNavigate({ from: "/" });
  const [person, setPerson] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<string | null>(null);
  const [inlineResult, setInlineResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(FREE_TRIES);
  const hydrated = useRef(false);

  useEffect(() => { setCredits(readGuestCredits()); }, []);

  useEffect(() => {
    let cancelled = false;
    readTryOnDraft()
      .then((draft) => {
        if (cancelled || !draft) return;
        setPerson((p) => p ?? (draft.person || null));
        setOutfit((o) => o ?? (draft.outfit || null));
      })
      .catch(() => {})
      .finally(() => { hydrated.current = true; });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveTryOnDraft({ person: person ?? "", outfit: outfit ?? "" }).catch(() => {});
  }, [person, outfit]);

  const outOfCredits = credits <= 0;

  const generate = async () => {
    if (!person || !outfit || loading || outOfCredits) return;
    // Optimistic lock: credit is held, not deducted, until a real image comes back.
    setLoading(true);
    setError(null);
    setBusy(false);
    setInlineResult(null);
    setStartedAt(Date.now());
    const { runTryOn, AllServersBusyError } = await import("@/lib/tryon-engine");
    try {
      const image = await runTryOn(person, outfit, (u) => { setStep(u.step); setServer(u.server ?? null); });
      // Commit on success.
      const next = Math.max(0, credits - 1);
      window.localStorage.setItem(GUEST_KEY, String(next));
      window.dispatchEvent(new Event("tryonix-credits-change"));
      setCredits(next);
      setStep("success");
      try {
        await saveTryOnRecord({ result: image, person, outfit, createdAt: new Date().toISOString() });
        navigate({ to: "/result" });
      } catch {
        setInlineResult(image);
      }
    } catch (e) {
      // Rollback: nothing was deducted.
      if (e instanceof AllServersBusyError) { setStep("server_busy"); setBusy(true); }
      else { setStep("idle"); setError(e instanceof Error ? e.message : "Something went wrong."); }
      toast.success("Credit restored.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="mx-auto max-w-5xl scroll-mt-24 px-5 pb-10 sm:px-6">
      <div className="rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold tracking-tight text-brand-navy">Try it right here</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-pink/20 bg-brand-pink-soft px-3.5 py-1.5 text-[13px] font-bold text-brand-navy">
            <Zap className="size-3.5 text-brand-pink" aria-hidden />
            {credits} free {credits === 1 ? "try-on" : "try-ons"} left
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <PickCard label="Upload Your Photo" hint="Clear full-body photo works best" chooseLabel="Choose Photo" icon={UserRound} value={person} onChange={setPerson} />
          <PickCard label="Upload Your Outfit" hint="Any clothing product image" chooseLabel="Choose Outfit" icon={Shirt} value={outfit} onChange={setOutfit} />
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={!person || !outfit || loading || outOfCredits}
          className="brand-gradient mt-6 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-bold text-white shadow-lg shadow-brand-pink/25 transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
        >
          {loading
            ? <><Loader2 className="size-5 animate-spin" /> Creating your try-on…</>
            : <><Sparkles className="size-5" /> Start Your Try-On <span aria-hidden>→</span></>}
        </button>

        {!person || !outfit ? (
          <p className="mt-3 text-center text-[13px] text-muted-foreground">
            Add both photos to start — no sign-up needed for your first {FREE_TRIES}.
          </p>
        ) : null}

        {outOfCredits && (
          <div className="mt-5 rounded-[20px] border border-border bg-secondary/60 p-5 text-center">
            <p className="text-[15px] font-bold text-brand-navy">Your {FREE_TRIES} free try-ons are used</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Free try-ons are used up. Premium plans are not available yet.
            </p>
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

        {inlineResult && !loading && (
          <div className="mt-7">
            <h3 className="text-[15px] font-bold text-brand-navy">Your result</h3>
            <div className="mt-3 overflow-hidden rounded-[20px] border border-border bg-secondary/50">
              <img src={inlineResult} alt="AI try-on result" className="mx-auto max-h-[540px] w-full object-contain" />
            </div>
            <a
              href={inlineResult}
              download={`tryonix-${Date.now()}.png`}
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 text-[15px] font-semibold hover-lift"
            >
              <Download className="size-4 text-brand-pink" /> Download Image
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function PickCard({
  label, hint, chooseLabel, icon: Icon, value, onChange,
}: {
  label: string;
  hint: string;
  chooseLabel: string;
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
    <div className="rounded-[22px] border-2 border-dashed border-brand-pink/25 bg-brand-pink-soft/40 p-4 sm:p-5">
      {value ? (
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <img src={value} alt={label} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-pink/40 px-4 py-2 text-[13px] font-bold text-brand-pink transition-colors hover:bg-brand-pink-soft"
            >
              <RefreshCw className="size-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label={`Remove ${label.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-secondary"
            >
              <X className="size-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); read(e.dataTransfer.files?.[0]); }}
          className="block w-full rounded-2xl px-4 py-7 text-center transition-colors hover:bg-white/60"
        >
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-white shadow-sm">
            <Icon className="size-6 text-brand-pink" aria-hidden />
          </span>
          <span className="mt-3 block text-[15px] font-bold text-brand-navy">{label}</span>
          <span className="mt-1 block text-[13px] text-muted-foreground">{hint}</span>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-pink/40 bg-white px-4 py-2 text-[13px] font-bold text-brand-pink">
            <Upload className="size-3.5" aria-hidden /> {chooseLabel}
          </span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={(e) => read(e.target.files?.[0])} />
    </div>
  );
}

/* ── Benefits ──────────────────────────────────────── */
function Benefits() {
  const items = [
    { icon: Zap, title: "Fast & Easy", text: "Just 2 photos, no extra steps" },
    { icon: ShieldCheck, title: "100% Private", text: "Your photos are safe with us" },
    { icon: Star, title: "High Quality Results", text: "Realistic and natural try-ons" },
    { icon: Heart, title: "Try Before You Buy", text: "Shop with confidence" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <div key={b.title} className="flex items-center gap-3.5 rounded-[20px] border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-pink-soft">
              <b.icon className="size-5 text-brand-pink" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-brand-navy">{b.title}</h3>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{b.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
