import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowRight, Check, Sparkles, Wand2, Shield, Smartphone, Zap, Crown,
  Camera, Download, Star, Menu, Twitter, Instagram, Github,
} from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";
import demoPerson from "@/assets/demo-person.jpg";
import demoOutfit from "@/assets/demo-outfit.jpg";
import demoResult from "@/assets/demo-result.jpg";
import { supabase } from "@/integrations/supabase/client";

const mascot = mascotAsset.url;

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TryOnix — Virtual AI Try-On for Any Outfit" },
      { name: "description", content: "TryOnix lets you upload your photo and any outfit to instantly see how it looks on you — powered by AI." },
      { property: "og:title", content: "TryOnix — Virtual AI Try-On" },
      { property: "og:description", content: "See yourself in any outfit before you buy. Realistic AI try-on in seconds." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav />
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <DemoShowcase />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------- NAV ---------- */
function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-primary-soft grid place-items-center overflow-hidden">
            <img src={mascot} alt="TryOnix" className="size-9 object-cover" />
          </div>
          <span className="font-bold text-lg text-primary">TryOnix</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          <a href="#reviews" className="hover:text-foreground transition">Reviews</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden sm:inline text-sm font-semibold text-foreground">Sign in</Link>
          <Link
            to="/auth"
            className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-[0_6px_20px_-8px_oklch(0.52_0.16_152/0.6)] active:scale-[0.98] transition"
          >
            Try Free <ArrowRight className="size-3.5" />
          </Link>
          <button className="md:hidden text-foreground"><Menu className="size-6" /></button>
        </div>
      </div>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,oklch(0.94_0.06_150)_0%,transparent_50%),radial-gradient(circle_at_80%_60%,oklch(0.94_0.06_150/0.6)_0%,transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="fade-up">
          <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-primary-soft text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" /> AI-Powered Virtual Try-On
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            See yourself in <span className="text-primary">any outfit</span> — instantly.
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
            Upload your photo and any clothing image. TryOnix's AI fits the outfit on you
            in seconds — photoreal, HD, and ready to share.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              className="h-13 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2 shadow-[0_10px_30px_-10px_oklch(0.52_0.16_152/0.6)] active:scale-[0.98] transition"
            >
              Start Free <ArrowRight className="size-4" />
            </Link>
            <a href="#how" className="h-13 px-6 py-3.5 rounded-full border border-border font-semibold text-sm hover:bg-card transition">
              See how it works
            </a>
          </div>
          <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><Check className="size-4 text-primary" /> 3 free try-ons</div>
            <div className="flex items-center gap-1"><Check className="size-4 text-primary" /> No credit card</div>
            <div className="flex items-center gap-1"><Check className="size-4 text-primary" /> HD downloads</div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="fade-up relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <HeroImg src={demoPerson} tag="Your photo" />
              <HeroImg src={demoOutfit} tag="Any outfit" />
            </div>
            <div className="relative">
              <HeroImg src={demoResult} tag="AI result" tall />
              <div className="absolute -top-4 -right-4 h-10 px-3 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1 shadow-lg rotate-3">
                <Sparkles className="size-3.5" /> Photoreal
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 h-12 px-4 rounded-2xl bg-card border border-border shadow-lg flex items-center gap-2 text-sm font-semibold">
            <div className="size-8 rounded-full bg-primary-soft grid place-items-center">
              <Zap className="size-4 text-primary" />
            </div>
            Generated in 4s
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroImg({ src, tag, tall }: { src: string; tag: string; tall?: boolean }) {
  return (
    <div className={`relative rounded-3xl overflow-hidden border border-border bg-card shadow-sm ${tall ? "aspect-[3/4]" : "aspect-square"}`}>
      <img src={src} alt={tag} className="absolute inset-0 w-full h-full object-cover" />
      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide bg-card/95 backdrop-blur px-2.5 py-1 rounded-full shadow-sm">{tag}</span>
    </div>
  );
}

/* ---------- LOGOS ---------- */
function LogosStrip() {
  const logos = ["Shopify", "Zara-ish", "H&M-esque", "Uniqlo-like", "Nike-y", "ASOS-y"];
  return (
    <section className="border-y border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by modern shoppers & storefronts
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {logos.map((l) => (
            <span key={l} className="text-lg font-bold tracking-tight text-muted-foreground">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES ---------- */
function Features() {
  const cards = [
    { title: "AI Try-On", desc: "Upload your photo and any outfit — get photoreal results in seconds.", Icon: Sparkles },
    { title: "Outfit Editor", desc: "Describe changes in text and watch your look transform instantly.", Icon: Wand2 },
    { title: "HD Downloads", desc: "Export 2048px images ready for social, ads, or lookbooks.", Icon: Download },
    { title: "Private by Default", desc: "Your photos stay yours. Encrypted and never sold.", Icon: Shield },
    { title: "Works Anywhere", desc: "Same account across web, tablet, and mobile.", Icon: Smartphone },
    { title: "Instant Results", desc: "Optimized AI pipeline delivers try-ons in under 10 seconds.", Icon: Zap },
  ];
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Features</div>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">Everything you need to try before you buy.</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Built for shoppers, creators, and Shopify storefronts who want realistic previews without a studio.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ title, desc, Icon }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-7 hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="size-12 rounded-2xl bg-primary-soft grid place-items-center">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW ---------- */
function HowItWorks() {
  const steps = [
    { Icon: Camera, title: "Upload your photo", desc: "A clear full-body photo works best." },
    { Icon: ShirtIcon, title: "Pick an outfit", desc: "Upload any garment image or paste a product link." },
    { Icon: Sparkles, title: "Generate", desc: "Our AI fits the outfit on you in seconds." },
    { Icon: Download, title: "Save & share", desc: "Download HD or share with friends." },
  ];
  return (
    <section id="how" className="py-24 md:py-32 bg-card/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">How it works</div>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">4 steps to your new look.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-4 gap-5">
          {steps.map(({ Icon, title, desc }, i) => (
            <div key={title} className="relative rounded-3xl bg-card border border-border p-6">
              <div className="absolute -top-4 left-6 h-8 px-3 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center">
                Step {i + 1}
              </div>
              <div className="mt-4 size-12 rounded-2xl bg-primary-soft grid place-items-center">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShirtIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

/* ---------- DEMO ---------- */
function DemoShowcase() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Live demo</div>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">Realistic try-ons — not model swaps.</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            TryOnix preserves your face, body shape, and pose. The AI adapts the outfit to
            you — not the other way around.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Preserves identity & pose", "Handles complex fabrics & prints", "Studio-grade lighting match"].map(x => (
              <li key={x} className="flex items-center gap-2"><Check className="size-4 text-primary" /> {x}</li>
            ))}
          </ul>
          <Link to="/auth" className="mt-8 inline-flex h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold items-center gap-2">
            Try it free <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="rounded-3xl border border-border overflow-hidden bg-card shadow-xl">
          <img src={demoResult} alt="Try-on preview" className="w-full aspect-[4/5] object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ---------- PRICING ---------- */
function Pricing() {
  const plans = [
    { name: "Free", price: "$0", tag: "Start exploring", features: ["3 try-ons / month", "Standard resolution", "Watermark-free"], cta: "Get started", highlight: false },
    { name: "Pro", price: "$12", period: "/mo", tag: "For creators", features: ["100 try-ons / month", "HD 2048px downloads", "Priority AI queue", "History gallery"], cta: "Start Pro", highlight: true },
    { name: "Studio", price: "$49", period: "/mo", tag: "For stores", features: ["Unlimited try-ons", "Shopify catalog import", "API access", "Team seats"], cta: "Contact sales", highlight: false },
  ];
  return (
    <section id="pricing" className="py-24 md:py-32 bg-card/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Pricing</div>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">Simple plans. Scale as you go.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-3xl p-8 border ${p.highlight ? "bg-primary text-primary-foreground border-primary shadow-2xl md:-translate-y-2" : "bg-card border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">{p.name}</div>
                {p.highlight && <span className="text-xs font-bold bg-primary-foreground text-primary px-2.5 py-1 rounded-full">Most popular</span>}
              </div>
              <div className={`text-xs mt-1 ${p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.tag}</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                {p.period && <span className={`text-sm ${p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.period}</span>}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className={`size-4 ${p.highlight ? "text-primary-foreground" : "text-primary"}`} /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-8 h-12 rounded-full inline-flex w-full items-center justify-center font-semibold ${p.highlight ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const reviews = [
    { name: "Aarav S.", role: "Shopper", text: "I stopped returning clothes. TryOnix shows me exactly how it fits before I checkout." },
    { name: "Maya R.", role: "Content creator", text: "I generate 20+ looks a day for reels. The HD quality is unreal." },
    { name: "Dev K.", role: "Shopify store owner", text: "Conversions up 22% after adding TryOnix on product pages." },
  ];
  return (
    <section id="reviews" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Loved by users</div>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">People are seeing themselves differently.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {reviews.map(r => (
            <div key={r.name} className="rounded-3xl border border-border bg-card p-7">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-primary" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{r.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="size-9 rounded-full bg-primary-soft grid place-items-center text-primary font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
function FinalCTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-[2.5rem] bg-primary text-primary-foreground p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_40%),radial-gradient(circle_at_70%_80%,white_0%,transparent_40%)]" />
          <div className="relative">
            <div className="size-16 mx-auto rounded-full bg-primary-foreground/15 grid place-items-center">
              <Crown className="size-7" />
            </div>
            <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">Ready to try yourself on?</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Sign up in 30 seconds and get 3 free HD try-ons. No credit card required.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-flex h-14 px-8 rounded-full bg-primary-foreground text-primary font-semibold items-center gap-2 shadow-xl"
            >
              Start Free <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-primary-soft overflow-hidden">
              <img src={mascot} alt="TryOnix" className="size-9 object-cover" />
            </div>
            <span className="font-bold text-lg text-primary">TryOnix</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            AI virtual try-on for shoppers, creators, and modern storefronts.
          </p>
          <div className="mt-5 flex gap-3">
            {[Twitter, Instagram, Github].map((Icon, i) => (
              <a key={i} href="#" className="size-9 rounded-full border border-border grid place-items-center text-muted-foreground hover:text-foreground hover:bg-card transition">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title="Product" links={[{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "How it works", href: "#how" }, { label: "Try free", href: "/app" }]} />
        <FooterCol title="Company" links={[{ label: "About", href: "/about" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }, { label: "Contact", href: "/contact" }]} />
        <FooterCol title="Legal" links={[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Security", href: "/privacy" }, { label: "Cookies", href: "/privacy" }]} />
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} TryOnix. All rights reserved.</div>
          <div>Made with AI, for real people.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-sm font-bold">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map(l => <li key={l.label}><a href={l.href} className="hover:text-foreground transition">{l.label}</a></li>)}
      </ul>
    </div>
  );
}
