// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const backendUrl = "https://uuozvnxgcfgllutdjxer.supabase.co";
const backendPublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1b3p2bnhnY2ZnbGx1dGRqeGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzUzODMsImV4cCI6MjA5NzMxMTM4M30.V8vF8L0fSs_d0-srMu22rFibB5swUx_--uXsbGKdg_E";

export default defineConfig({
  // Force the server bundle to be generated outside Lovable too.
  // On Vercel this lets Nitro auto-detect the Vercel preset instead of shipping
  // a static/empty build that can show a blank page or 404.
  nitro: true,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    define: {
      "process.env.SUPABASE_URL": JSON.stringify(backendUrl),
      "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(backendPublishableKey),
      "process.env.VITE_SUPABASE_URL": JSON.stringify(backendUrl),
      "process.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(backendPublishableKey),
    },
  },
});
