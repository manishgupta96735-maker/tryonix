# TryOnix Playful Creator Redesign

## Plan
- Rework the existing home page into the reference's playful creator look while keeping its current photo uploads, guest-use tracking, generation API, errors, retry, and downloads intact.
- Add shared public-site navigation and footer, reflecting the actual remaining guest tries, and apply them to the new pages plus existing public about, contact, privacy, and terms pages.
- Add `/result`, `/how-it-works`, `/examples`, and `/faq`. Persist successful generated result/source images for the result page; use only existing demo images and clearly label them as samples, with honest empty states for unavailable categories.
- Update semantic design tokens for the supplied pink/coral/lavender/navy palette, then verify navigation, mobile/desktop rendering, and the unchanged generation request path.

## Technical details
- Keep TanStack Start routes and existing API/backend integrations. Share public header/footer and guest-usage state in small reusable modules; store large result payloads in IndexedDB so result navigation survives refresh without local-storage size limits.
- Add route-specific metadata and respect the project's existing no-sign-in-first preference. Do not add fake examples, claims, checkout, authentication gates, or dependencies.
