import { logCreditEvent } from "@/lib/credit-ledger";

const GUEST_KEY = "tryonix_guest_credits_v1";
const DAY_KEY = "tryonix_guest_day_v1";
export const DAILY_FREE = 3;

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** Reads guest credits, automatically topping up to DAILY_FREE once per new day (extras kept). */
export function readDailyCredits(): number {
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    const n = raw === null ? DAILY_FREE : Number(raw);
    let current = Number.isFinite(n) ? Math.max(0, n) : DAILY_FREE;
    if (window.localStorage.getItem(DAY_KEY) !== today()) {
      const before = current;
      current = Math.max(current, DAILY_FREE);
      window.localStorage.setItem(DAY_KEY, today());
      window.localStorage.setItem(GUEST_KEY, String(current));
      if (current > before) logCreditEvent("daily", current - before, "Daily free try-ons restored");
    }
    return current;
  } catch {
    return DAILY_FREE;
  }
}

/** Adds bonus try-ons (used by referrals). Returns the new count. */
export function grantExtraCredits(amount: number, note?: string): number {
  const next = readDailyCredits() + amount;
  try { window.localStorage.setItem(GUEST_KEY, String(next)); } catch { /* ignore */ }
  logCreditEvent("referral", amount, note ?? "Referral bonus");
  window.dispatchEvent(new Event("tryonix-credits-change"));
  return next;
}
