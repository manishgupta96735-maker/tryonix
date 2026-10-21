import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Shirt, UserRound } from "lucide-react";
import { PublicPage } from "@/components/SiteChrome";
import demoPerson from "@/assets/demo-person.jpg";
import demoOutfit from "@/assets/demo-outfit.jpg";
import demoResult from "@/assets/demo-result.jpg";

export const Route = createFileRoute("/how-it-works")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "How It Works — TryOnix" },
      { name: "description", content: "Get your virtual try-on in just 3 simple steps: upload your photo, upload your outfit, get your result." },
      { property: "og:title", content: "How It Works — TryOnix" },
      { property: "og:description", content: "Get your virtual try-on in just 3 simple steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HowItWorksPage,
});

const STEPS = [
  {
    n: 1,
    badge: "bg-brand-pink",
    img: demoPerson,
    alt: "Step 1 example: a clear full-body photo",
    title: "Upload Your Photo",
    text: "Use a clear full-body photo for best results.",
  },
  {
    n: 2,
    badge: "bg-brand-lavender",
    img: demoOutfit,
    alt: "Step 2 example: an outfit product image",
    title: "Upload Your Outfit",
    text: "Any clothing product image works.",
  },
  {
    n: 3,
    badge: "bg-brand-coral",
    img: demoResult,
    alt: "Step 3 example: the AI try-on result",
    title: "Get Your Result",
    text: "See how you look in it instantly with AI.",
  },
];

const TIPS = [
  {
    icon: UserRound,
    title: "Use a clear photo",
    text: "A well-lit, full-body photo where you're standing naturally gives the most realistic result.",
  },
  {
    icon: Shirt,
    title: "Pick good outfit images",
    text: "Front-facing product photos on a plain background — like from a shop listing — work best.",
  },
  {
    icon: Check,
    title: "Supported formats",
    text: "Common image formats like JPG, PNG, and WebP are all supported.",
  },
];

function HowItWorksPage() {
  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            How <span className="text-gradient">It Works</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Get your virtual try-on in just 3 simple steps.
          </p>
        </div>

        <div className="relative mt-14">
          <ArrowRight aria-hidden className="absolute left-1/3 top-[26%] hidden -translate-x-1/2 size-8 text-brand-pink lg:block" />
          <ArrowRight aria-hidden className="absolute left-2/3 top-[26%] hidden -translate-x-1/2 size-8 text-brand-pink lg:block" />
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <article key={step.n} className="hover-lift relative rounded-[26px] border border-border bg-card p-5 text-center shadow-[var(--shadow-soft)]">
                <span className={`absolute -top-3.5 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full ${step.badge} text-sm font-extrabold text-white shadow-md`}>
                  {step.n}
                </span>
                <img src={step.img} alt={step.alt} className="aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" />
                <h2 className="mt-5 text-lg font-extrabold text-brand-navy">{step.title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            hash="upload"
            className="brand-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-pink/25 transition-transform hover:-translate-y-0.5"
          >
            Try It Now <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold text-brand-navy">Get the best results</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-muted-foreground">
          A few small things make your try-ons look noticeably better.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {TIPS.map((tip) => (
            <div key={tip.title} className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <span className="grid size-11 place-items-center rounded-full bg-brand-pink-soft">
                <tip.icon className="size-5 text-brand-pink" aria-hidden />
              </span>
              <h3 className="mt-4 text-[15px] font-bold text-brand-navy">{tip.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
