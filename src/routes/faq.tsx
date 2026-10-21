import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Sparkles } from "lucide-react";
import { PublicPage } from "@/components/SiteChrome";

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
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Frequently Asked <span className="text-gradient">Questions</span>
            <Sparkles className="ml-2 inline size-7 text-brand-coral" aria-hidden />
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Everything you need to know about TryOnix.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-[18px] border border-border bg-card px-5 shadow-[var(--shadow-soft)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-bold text-brand-navy">
                {faq.q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-[26px] border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <h2 className="text-2xl font-extrabold text-brand-navy">Ready to Try a New Look?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Upload your photo and outfit, and see the result in seconds.
          </p>
          <Link
            to="/"
            hash="upload"
            className="brand-gradient mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-pink/25 transition-transform hover:-translate-y-0.5"
          >
            Try It Now <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </PublicPage>
  );
}
