/** Local credit ledger — records every credit change on this device (no account). */
export type CreditKind = "daily" | "referral" | "tryon" | "visit";

export type CreditEntry = {
  /** Local day key, e.g. "2026-11-3" */
  d: string;
  /** ISO timestamp */
  t: string;
  k: CreditKind;
  /** Positive = credits received, negative = credits used, 0 = info-only event */
  a: number;
  /** Short human label */
  n?: string;
};

const LOG_KEY = "tryonix_credit_log_v1";
const MAX_ENTRIES = 400;

export function logCreditEvent(kind: CreditKind, amount: number, note?: string) {
  try {
    const now = new Date();
    const entry: CreditEntry = {
      d: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      t: now.toISOString(),
      k: kind,
      a: amount,
      n: note,
    };
    const log = readLedger();
    log.unshift(entry);
    window.localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, MAX_ENTRIES)));
  } catch {
    /* storage unavailable — history is best-effort */
  }
}

export function readLedger(): CreditEntry[] {
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CreditEntry[]) : [];
  } catch {
    return [];
  }
}
