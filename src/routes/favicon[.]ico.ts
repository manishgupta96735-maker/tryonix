import { createFileRoute } from "@tanstack/react-router";
import faviconAsset from "@/assets/favicon.ico.asset.json";

export const Route = createFileRoute("/favicon.ico")({
  server: {
    handlers: {
      GET: async () => Response.redirect(new URL(faviconAsset.url, "https://tryonix.lovable.app"), 302),
    },
  },
});