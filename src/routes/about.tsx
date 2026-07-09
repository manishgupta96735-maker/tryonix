import { createFileRoute, Link } from "@tanstack/react-router";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { Sparkles, Shield, Zap, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "About — TryOnix" },
      { name: "description", content: "TryOnix is an AI virtual try-on platform helping shoppers see outfits on themselves before buying." },
      { property: "og:title", content: "About TryOnix" },
      { property: "og:description", content: "Our mission: make online fashion shopping confident and returns-free with AI try-on." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-5 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary">
            <img src={mascotAsset.url} alt="TryOnix" className="size-8 rounded-full" />
            <span>TryOnix</span>
          </Link>
          <Link to="/app" className="text-sm rounded-full bg-primary text-primary-foreground px-4 py-2 font-semibold">Try free</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="text-4xl font-bold tracking-tight">About TryOnix</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          TryOnix is an AI-powered virtual try-on platform that helps people see how any outfit looks on
          them — in seconds, from a single photo. We're on a mission to make online fashion feel as
          confident as trying clothes in a physical store.
        </p>

        <section className="mt-10 grid sm:grid-cols-2 gap-4">
          {[
            { icon: Sparkles, title: "Realistic AI", body: "State-of-the-art diffusion models render your outfit with true-to-life fit, drape, and lighting." },
            { icon: Zap, title: "Fast", body: "Most try-ons finish in under 10 seconds so you can iterate on styles quickly." },
            { icon: Shield, title: "Private", body: "Your photos are encrypted in transit and never used to train third-party models." },
            { icon: Heart, title: "Made for shoppers", body: "Built with retailers and everyday shoppers to reduce returns and boost confidence." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border p-5 bg-card">
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Our story</h2>
          <p className="mt-3 text-muted-foreground">
            TryOnix started because online shopping returns are painful — for shoppers, retailers, and
            the planet. We built a tool that gives everyone the "try before you buy" moment, without
            leaving their couch. Today, thousands of users trust TryOnix to preview outfits every day.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Get in touch</h2>
          <p className="mt-3 text-muted-foreground">
            Questions, partnerships, or feedback? Visit our{" "}
            <Link to="/contact" className="text-primary underline">Contact page</Link> or email{" "}
            <a href="mailto:hello@tryonix.app" className="text-primary underline">hello@tryonix.app</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
