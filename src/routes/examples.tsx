import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MoveRight } from "lucide-react";
import { PlayfulBackdrop, PublicPage, TitleSparkle } from "@/components/SiteChrome";
import tee from "@/assets/examples/outfit-tee.jpg";
import jacket from "@/assets/examples/outfit-jacket.jpg";
import blueDress from "@/assets/examples/outfit-bluedress.jpg";
import hoodie from "@/assets/examples/outfit-hoodie.jpg";
import redDress from "@/assets/examples/outfit-reddress.jpg";
import suit from "@/assets/examples/outfit-suit.jpg";
import resultTee from "@/assets/examples/result-tee.jpg";
import resultJacket from "@/assets/examples/result-jacket.jpg";
import resultBlueDress from "@/assets/examples/result-bluedress.jpg";
import resultHoodie from "@/assets/examples/result-hoodie.jpg";
import resultRedDress from "@/assets/examples/result-reddress.jpg";
import resultSuit from "@/assets/examples/result-suit.jpg";

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: "Examples — TryOnix Virtual Try-On" },
      { name: "description", content: "See sample outfits you can try on yourself with TryOnix." },
      { property: "og:title", content: "Examples — TryOnix" },
      { property: "og:description", content: "Sample outfits and try-on previews from TryOnix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExamplesPage,
});

const categories = ["All", "Casual", "Formal", "Party", "Streetwear"] as const;
type Category = (typeof categories)[number];

const items: { title: string; category: Exclude<Category, "All">; outfit: string; result: string }[] = [
  { title: "Classic white tee", category: "Casual", outfit: tee, result: resultTee },
  { title: "Leather jacket", category: "Streetwear", outfit: jacket, result: resultJacket },
  { title: "Blue evening dress", category: "Party", outfit: blueDress, result: resultBlueDress },
  { title: "Green hoodie", category: "Casual", outfit: hoodie, result: resultHoodie },
  { title: "Red satin dress", category: "Party", outfit: redDress, result: resultRedDress },
  { title: "Black formal suit", category: "Formal", outfit: suit, result: resultSuit },
];

function ExamplesPage() {
  const [active, setActive] = useState<Category>("All");
  const shown = items.filter((i) => active === "All" || i.category === active);

  return (
    <PublicPage>
      <section className="relative overflow-hidden">
        <PlayfulBackdrop />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              Real <span className="text-brand-pink">Examples</span>
              <TitleSparkle className="ml-2 inline-block size-7 -translate-y-1 text-[#ffc93c] sm:size-8" />
              <TitleSparkle className="ml-1 inline-block size-4 -translate-y-2 text-brand-pink sm:size-5" />
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              See how TryOnix helps people try different styles.
            </p>
          </div>

          <div className="mt-9 mb-9 flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Filter examples">
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={active === c} onClick={() => setActive(c)}
                className={`min-h-10 rounded-full px-5 text-sm font-bold transition-colors ${active === c ? "brand-gradient text-white shadow-sm" : "border border-border bg-card text-brand-navy hover:bg-brand-pink-soft"}`}>
                {c}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-brand-pink/30 bg-card p-10 text-center">
              <p className="text-lg font-bold text-brand-navy">No {active.toLowerCase()} samples yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Upload your own {active.toLowerCase()} outfit and see it on you.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((i) => (
                <article key={i.title} className="hover-lift rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
                    <img src={i.outfit} alt={`${i.title} outfit`} loading="lazy" width={1024} height={1024} className="aspect-[3/4] w-full rounded-xl object-cover" />
                    <MoveRight aria-hidden className="mx-auto size-5 shrink-0 text-brand-pink" />
                    <img src={i.result} alt={`Try-on result wearing ${i.title.toLowerCase()}`} loading="lazy" width={1024} height={1024} className="aspect-[3/4] w-full rounded-xl object-cover" />
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/"
              hash="upload"
              className="brand-gradient inline-flex items-center gap-2.5 rounded-full px-10 py-4 text-[15px] font-bold text-white shadow-lg shadow-brand-pink/25 transition-transform hover:-translate-y-0.5"
            >
              Try This Yourself <MoveRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
