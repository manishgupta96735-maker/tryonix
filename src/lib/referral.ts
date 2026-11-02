import { supabase } from "@/integrations/supabase/client";
import { grantExtraCredits } from "@/components/Ads";

export const REFERRAL_REWARD = 2;
const SECRET_KEY = "tryonix_device_id_v1";
const CODE_KEY = "tryonix_ref_code_v1";
const VISITED_KEY = "tryonix_ref_visited_v1";
const SITE = "https://aitryonix.vercel.app";

function deviceId(): string {
  let id = localStorage.getItem(SECRET_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(SECRET_KEY, id); }
  return id;
}

export async function getReferralLink(): Promise<string> {
  let code = localStorage.getItem(CODE_KEY);
  if (!code) {
    const { data, error } = await supabase.rpc("referral_register", { _secret: deviceId() });
    if (error || !data) throw new Error("Could not create link");
    code = data as string;
    localStorage.setItem(CODE_KEY, code);
  }
  return `${SITE}/?ref=${code}`;
}

/** Called on page load: records a friend's visit from ?ref= once per device, then cleans the URL. */
export async function recordReferralVisit() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("ref");
  if (!code) return;
  url.searchParams.delete("ref");
  window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  if (localStorage.getItem(VISITED_KEY) === code || localStorage.getItem(CODE_KEY) === code) return;
  localStorage.setItem(VISITED_KEY, code);
  await supabase.rpc("referral_visit", { _code: code.slice(0, 20), _visitor: deviceId() });
}

/** Adds any pending rewards for this device's link. Returns how many try-ons were added. */
export async function claimReferralRewards(): Promise<number> {
  if (!localStorage.getItem(CODE_KEY)) return 0;
  const { data } = await supabase.rpc("referral_claim", { _secret: deviceId() });
  const credits = Number((data as { credits?: number } | null)?.credits ?? 0);
  if (credits > 0) grantExtraCredits(credits);
  return credits;
}
