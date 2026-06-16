import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShoppingBag, Zap, Shield, Check, Star } from "lucide-react";
import heroImg from "@/assets/hero-tryon.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitMirror — AI Virtual Try-On for Shopify Stores" },
      { name: "description", content: "Let your customers try clothes on themselves, not on models. AI-powered virtual try-on plugin for Shopify." },
      { property: "og:title", content: "FitMirror — AI Virtual Try-On for Shopify" },
      { property: "og:description", content: "Boost conversions. Reduce returns. Customers see clothes on their own photo." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav />
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <div className="size-7 rounded-md bg-foreground text-background grid place-items-center text-sm font-bold">F</div>
          FitMirror
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <Link to="/try-on" className="text-sm font-medium bg-foreground text-background px-4 h-9 rounded-full inline-flex items-center gap-1.5 hover:opacity-90 transition">
          Try demo <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-12 md:pt-28 md:pb-20 text-center fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-6">
          <Sparkles className="size-3.5" /> AI-powered fitting room for Shopify
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight">
          Try clothes on <em className="italic">yourself</em>,<br className="hidden md:block" /> not on a model.
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-muted-foreground text-base md:text-lg">
          FitMirror plugs into your Shopify store. Customers upload one photo and see every product on their own body — in seconds.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/try-on" className="bg-foreground text-background h-12 px-6 rounded-full inline-flex items-center gap-2 font-medium hover:opacity-90">
            Try it free <ArrowRight className="size-4" />
          </Link>
          <a href="#how" className="h-12 px-6 rounded-full border border-border inline-flex items-center font-medium hover:bg-muted">
            See how it works
          </a>
        </div>

        <div className="mt-14 md:mt-20 relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background" />
          <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
            <img src={heroImg} alt="Before and after AI virtual try-on demo" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LogosStrip() {
  const logos = ["ZARA", "ASOS", "H&M", "UNIQLO", "MYNTRA", "SHEIN"];
  return (
    <section className="border-y border-border py-8">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">Built for stores that sell fashion</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-60">
          {logos.map(l => <span key={l} className="font-display text-xl">{l}</span>)}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Zap, title: "One-click try-on", desc: "Customers upload one photo and try unlimited products instantly." },
    { icon: ShoppingBag, title: "Shopify native", desc: "Install in 60 seconds. Auto-sync your entire product catalog." },
    { icon: Sparkles, title: "Photoreal AI", desc: "State-of-the-art diffusion models preserve fabric, fit and lighting." },
    { icon: Shield, title: "Privacy-first", desc: "Photos auto-delete after 24 hours. GDPR compliant by default." },
  ];
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl">Everything your store needs to convert.</h2>
          <p className="mt-4 text-muted-foreground">Stop showing the same five models. Show every shopper themselves.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-border hover:border-foreground/40 transition">
              <Icon className="size-5 mb-4" />
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Connect Shopify", d: "One-click OAuth. We sync your products automatically." },
    { n: "02", t: "Customer uploads photo", d: "A simple widget appears on every product page." },
    { n: "03", t: "AI renders the try-on", d: "Photoreal preview in under 8 seconds. They buy with confidence." },
  ];
  return (
    <section id="how" className="py-20 md:py-28 bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-4xl md:text-5xl max-w-2xl">From install to first try-on in three minutes.</h2>
        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {steps.map(s => (
            <div key={s.n}>
              <div className="font-display text-5xl opacity-40">{s.n}</div>
              <h3 className="mt-4 text-xl font-medium">{s.t}</h3>
              <p className="mt-2 text-sm opacity-70">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Starter", price: "$0", per: "/mo", desc: "Try it on a small store.", features: ["100 try-ons/mo", "1 Shopify store", "Email support"], cta: "Start free" },
    { name: "Growth", price: "$49", per: "/mo", desc: "Most popular for DTC brands.", features: ["5,000 try-ons/mo", "Unlimited products", "Priority support", "Custom branding"], cta: "Start trial", featured: true },
    { name: "Scale", price: "Custom", per: "", desc: "For enterprise catalogs.", features: ["Unlimited try-ons", "API access", "Dedicated CSM", "SLA"], cta: "Contact sales" },
  ];
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl">Simple pricing.</h2>
          <p className="mt-4 text-muted-foreground">No hidden fees. Cancel anytime.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.name} className={`p-8 rounded-3xl border ${p.featured ? "bg-foreground text-background border-foreground" : "border-border"}`}>
              <h3 className="font-medium">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl">{p.price}</span>
                <span className={`text-sm ${p.featured ? "opacity-70" : "text-muted-foreground"}`}>{p.per}</span>
              </div>
              <p className={`mt-2 text-sm ${p.featured ? "opacity-70" : "text-muted-foreground"}`}>{p.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2 items-center"><Check className="size-4 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/try-on" className={`mt-8 h-11 px-5 w-full rounded-full inline-flex items-center justify-center font-medium ${p.featured ? "bg-background text-foreground" : "bg-foreground text-background"}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { q: "Returns dropped 31% in the first month. FitMirror paid for itself by week two.", a: "Priya M.", r: "Founder, Loom & Linen" },
    { q: "Our conversion rate doubled on mobile. Customers love seeing it on themselves.", a: "Daniel K.", r: "Head of Ecom, Northwood" },
    { q: "Setup took five minutes. Five. And our catalog is 4,000 SKUs.", a: "Sara T.", r: "DTC Manager, Atelier" },
  ];
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-4xl md:text-5xl max-w-2xl">Loved by modern fashion brands.</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {t.map(x => (
            <figure key={x.a} className="p-6 rounded-2xl border border-border">
              <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-foreground" />)}</div>
              <blockquote className="text-sm">"{x.q}"</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">{x.a} — {x.r}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <h2 className="font-display text-5xl md:text-6xl">Ready to ship the future of fitting rooms?</h2>
        <p className="mt-5 text-muted-foreground">Install on your Shopify store in under a minute.</p>
        <Link to="/try-on" className="mt-8 bg-foreground text-background h-12 px-7 rounded-full inline-flex items-center gap-2 font-medium">
          Try the demo <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-foreground text-background grid place-items-center text-[10px] font-bold">F</div>
          © {new Date().getFullYear()} FitMirror
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
