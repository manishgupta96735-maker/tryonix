import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro, PublicPage } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import tee from "@/assets/examples/outfit-tee.jpg";
import jacket from "@/assets/examples/outfit-jacket.jpg";
import blueDress from "@/assets/examples/outfit-bluedress.jpg";
import hoodie from "@/assets/examples/outfit-hoodie.jpg";
import demoPerson from "@/assets/demo-person.jpg";
import demoOutfit from "@/assets/demo-outfit.jpg";
import demoResult from "@/assets/demo-result.jpg";

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

const items: { title: string; category: Exclude<Category, "All">; outfit: string; person?: string; result?: string }[] = [
  { title: "Sample try-on", category: "Casual", outfit: demoOutfit, person: demoPerson, result: demoResult },
  { title: "Classic white tee", category: "Casual", outfit: tee },
  { title: "Leather jacket", category: "Streetwear", outfit: jacket },
  { title: "Blue evening dress", category: "Party", outfit: blueDress },
  { title: "Green hoodie", category: "Streetwear", outfit: hoodie },
];

function ExamplesPage() {
  const [active, setActive] = useState<Category>("All");
  const shown = items.filter((i) => active === "All" || i.category === active);

  return (
    <PublicPage>
      <PageIntro eyebrow="Sample gallery" title="Real Examples" subtitle="See how different outfits can transform your style. These are sample images — try any outfit on your own photo." />
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter examples">
          {categories.map((c) => (
            <button key={c} role="tab" aria-selected={active === c} onClick={() => setActive(c)}
              className={`min-h-10 rounded-full px-4 text-sm font-bold transition-colors ${active === c ? "brand-gradient text-white shadow-sm" : "border border-border bg-card text-brand-navy hover:bg-brand-pink-soft"}`}>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((i) => (
              <article key={i.title} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-1">
                {i.result ? (
                  <div className="grid grid-cols-3 gap-1 bg-brand-pink-soft p-1">
                    {[i.person!, i.outfit, i.result].map((src, n) => (
                      <img key={n} src={src} alt={["Person photo", "Outfit", "Try-on result"][n]} loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover" />
                    ))}
                  </div>
                ) : (
                  <img src={i.outfit} alt={i.title} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                )}
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h2 className="font-bold text-brand-navy">{i.title}</h2>
                    <p className="text-xs text-muted-foreground">{i.category} · sample</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Button asChild className="brand-gradient min-h-12 rounded-full px-6 text-white">
            <Link to="/" hash="upload">Try This Yourself <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </div>
    </PublicPage>
  );
}
