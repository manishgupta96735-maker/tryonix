import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronDown, Upload, Shirt, UserRound, Tag, LayoutGrid, Share, Smartphone, HelpCircle,
} from "lucide-react";
import { PublicPage, TitleSparkle } from "@/components/SiteChrome";

const ICONS = [Upload, Shirt, UserRound, Tag, LayoutGrid, Share, Smartphone, HelpCircle];

export const Route = createFileRoute("/faq")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — TryOnix" },
      { name: "description", content: "Everything you need to know about TryOnix — free tries, photo tips, privacy, and more." },
      { property: "og:title", content: "Frequently Asked Questions — TryOnix" },
      { property: "og:description", content: "Everything you need to know about TryOnix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Is TryOnix free to use?",
    a: "Yes. Your first 3 try-ons are completely free — no account and no payment needed.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. You can start immediately by uploading your photos. An account is only needed later if you want a premium plan.",
  },
  {
    q: "What kind of photos work best?",
    a: "A clear, well-lit, full-body photo of yourself works best. Stand naturally and avoid heavy filters or tight cropping.",
  },
  {
    q: "Can I try any clothing item?",
    a: "Most clothing works — tops, dresses, jackets, and full outfits. Clear, front-facing product photos give the most realistic results.",
  },
  {
    q: "How accurate are the results?",
    a: "TryOnix keeps your face, body, and pose while fitting the outfit. Results are realistic, but they are AI-generated, so small details can vary between tries.",
  },
  {
    q: "Is my data safe and private?",
    a: (
      <>
        Yes. Your photos are used only to create your result and are never shared or sold. See our{" "}
        <Link to="/privacy" className="font-semibold text-brand-pink hover:underline">Privacy Policy</Link>{" "}
        for the details.
      </>
    ),
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes. TryOnix works in any modern mobile browser — no app install needed.",
  },
  {
    q: "What if the result doesn't look good?",
    a: "Try a clearer photo of yourself or a cleaner outfit image, then run the try-on again. Better input photos usually mean better results.",
  },
];

function FaqPage() {
  return (
    <PublicPage>
      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-40 size-56 rounded-full bg-brand-lavender/25 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-brand-peach/60 blur-2xl" />
          <div className="absolute -right-20 bottom-0 size-72 rounded-full bg-brand-pink/15 blur-2xl" />
          <span className="absolute left-[8%] top-20 text-6xl font-light text-brand-lavender">?</span>
          <span className="absolute right-[8%] top-28 text-5xl text-brand-pink">♡</span>
          <TitleSparkle className="absolute left-[6%] bottom-40 size-8 text-brand-pink" />
          <TitleSparkle className="absolute right-[18%] top-16 size-5 text-brand-peach" />
        </div>
      <section className="relative mx-auto max-w-3xl px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Everything you need to know about TryOnix.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
            <details key={faq.q} className="group rounded-[14px] bg-card px-5 shadow-[var(--shadow-soft)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-bold text-brand-navy">
                <span className="flex items-center gap-3"><Icon className="size-4 shrink-0 text-brand-navy" aria-hidden />{faq.q}</span>
                <ChevronDown className="size-4 shrink-0 text-brand-navy transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">{faq.a}</p>
            </details>
            );
          })}
        </div>
      </section>
      </div>
    </PublicPage>
  );
}
