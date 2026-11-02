const GUEST_KEY = "tryonix_guest_credits_v1";
export const EXTRA_TRIES = 3;

/** Adds extra guest try-ons (no ads). Returns the new count. */
export function grantExtraCredits(amount = EXTRA_TRIES): number {
  let current = 0;
  try {
    const n = Number(window.localStorage.getItem(GUEST_KEY) ?? "0");
    current = Number.isFinite(n) ? Math.max(0, n) : 0;
  } catch { /* storage blocked */ }
  const next = current + amount;
  try { window.localStorage.setItem(GUEST_KEY, String(next)); } catch { /* ignore */ }
  window.dispatchEvent(new Event("tryonix-credits-change"));
  return next;
}
