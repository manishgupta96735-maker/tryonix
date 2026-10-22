import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PlayfulBackdrop, PublicPage, TitleSparkle } from "@/components/SiteChrome";
import resultTee from "@/assets/examples/result-tee.jpg";
import outfitPinkHoodie from "@/assets/examples/outfit-pinkhoodie.jpg";
import resultPinkHoodie from "@/assets/examples/result-pinkhoodie.jpg";

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
    card: "bg-brand-pink-soft/50",
    img: resultTee,
    alt: "Step 1 example: a clear photo of a person",
    title: "Upload Your Photo",
    text: "Use a clear full-body photo for best results.",
  },
  {
    n: 2,
    badge: "bg-brand-blue",
    card: "bg-card",
    img: outfitPinkHoodie,
    alt: "Step 2 example: a clothing product image",
    title: "Upload Your Outfit",
    text: "Any clothing product image works.",
  },
  {
    n: 3,
    badge: "bg-brand-blue",
    card: "bg-card",
    img: resultPinkHoodie,
    alt: "Step 3 example: the AI try-on result",
    title: "Get Your Result",
    text: "See how you look in it instantly with AI.",
  },
];

function HowItWorksPage() {
  return (
    <PublicPage>
      <section className="relative overflow-hidden">
        <PlayfulBackdrop />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              How It <span className="text-brand-pink">Works</span>
              <TitleSparkle className="ml-2 inline-block size-7 -translate-y-1 text-[#ffc93c] sm:size-8" />
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Get your virtual try-on in just 3 simple steps.
            </p>
          </div>

          <div className="relative mt-14">
            <ArrowRight aria-hidden className="absolute left-1/3 top-[24%] hidden size-9 -translate-x-1/2 text-brand-navy lg:block" />
            <ArrowRight aria-hidden className="absolute left-2/3 top-[24%] hidden size-9 -translate-x-1/2 text-brand-navy lg:block" />
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
              {STEPS.map((step) => (
                <article key={step.n} className={`hover-lift relative rounded-[26px] border border-border p-4 pb-6 text-center shadow-[var(--shadow-soft)] ${step.card}`}>
                  <span className={`absolute -top-4 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full text-sm font-extrabold text-white shadow-md ${step.badge}`}>
                    {step.n}
                  </span>
                  <img src={step.img} alt={step.alt} width={1024} height={1024} loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
                  <h2 className="mt-5 text-lg font-extrabold text-brand-navy">{step.title}</h2>
                  <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-6 text-muted-foreground">{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              hash="upload"
              className="brand-gradient inline-flex items-center gap-2.5 rounded-full px-10 py-4 text-[15px] font-bold text-white shadow-lg shadow-brand-pink/25 transition-transform hover:-translate-y-0.5"
            >
              Try It Now <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
