import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "TryOnix — AI Outfit Try-On" },
      { name: "description", content: "Try an outfit on your photo with TryOnix." },
      { property: "og:title", content: "TryOnix — AI Outfit Try-On" },
      { property: "og:description", content: "Try an outfit on your photo with TryOnix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => null,
});

