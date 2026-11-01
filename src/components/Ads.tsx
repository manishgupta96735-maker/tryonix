import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Play, Watch, X, Footprints } from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";

const GUEST_KEY = "tryonix_guest_credits_v1";

/** Adds one guest try-on after a completed rewarded ad. Returns the new count. */
export function grantRewardCredit(): number {
  let current = 0;
  try {
    const n = Number(window.localStorage.getItem(GUEST_KEY) ?? "0");
    current = Number.isFinite(n) ? Math.max(0, n) : 0;
  } catch { /* storage blocked */ }
  const next = current + 1;
  try { window.localStorage.setItem(GUEST_KEY, String(next)); } catch { /* ignore */ }
  window.dispatchEvent(new Event("tryonix-credits-change"));
  return next;
}

function resetLabel() {
  const d = new Date();
  d.setHours(19, 30, 0, 0);
  return `${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} today`;
}

type BannerProps = {
  variant: "home" | "result";
};

/** Sponsored banner slot. Replace the inner card with an AdSense/Adsterra unit when ready. */
export function BannerAd({ variant }: BannerProps) {
  const home = variant === "home";
  const Icon = home ? Footprints : Watch;
  return (
    <section aria-label="Advertisement" className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
      <div className={home ? "" : "rounded-[24px] border border-dashed border-brand-pink/40 p-4 sm:p-6"}>
        {!home && (
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-widest text-brand-pink">Advertisement</p>
        )}
        <div className="relative flex flex-col items-center gap-5 rounded-[22px] border border-brand-pink/20 bg-brand-pink-soft/70 p-4 sm:flex-row sm:p-5">
          <span className="absolute right-3 top-3 rounded-md bg-brand-pink px-1.5 py-0.5 text-[10px] font-bold text-white">Ad</span>
          <div className="relative grid h-24 w-full shrink-0 place-items-center rounded-2xl bg-card sm:w-40">
            <span className="absolute left-2 top-2 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Sponsored</span>
            <Icon className="size-10 text-brand-pink" aria-hidden />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold text-brand-navy">{home ? "Upgrade Your Style" : "Premium Watches"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {home ? "Best Fashion Deals  |  Up to 60% Off" : "Style That Matches You"}
            </p>
          </div>
          <a href="#" onClick={(e) => e.preventDefault()} rel="sponsored nofollow" className="brand-gradient rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md sm:mr-6">
            Shop Now →
          </a>
        </div>
      </div>
    </section>
  );
}

/** Rewarded ad dialog: watch a short ad, earn one extra try-on. */
export function RewardedAdModal({ open, onClose, onRewarded }: { open: boolean; onClose: () => void; onRewarded: (credits: number) => void }) {
  const [phase, setPhase] = useState<"offer" | "playing">("offer");
  const [left, setLeft] = useState(15);

  useEffect(() => { if (open) { setPhase("offer"); setLeft(15); } }, [open]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (left <= 0) {
      onRewarded(grantRewardCredit());
      onClose();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left, onRewarded, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Watch a short ad" className="fixed inset-0 z-50 grid place-items-center bg-brand-navy/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-[28px] bg-card p-6 text-center shadow-2xl">
        {phase === "offer" && (
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-muted-foreground hover:text-brand-navy">
            <X className="size-5" />
          </button>
        )}
        <div className="relative mx-auto w-fit">
          <img src={mascotAsset.url} alt="" className="size-24 rounded-3xl object-cover" />
          <span className="brand-gradient absolute -bottom-1 -right-3 grid size-9 place-items-center rounded-xl text-white shadow-md">
            <Play className="size-4 fill-current" />
          </span>
        </div>

        {phase === "offer" ? (
          <>
            <h2 className="mt-5 text-2xl font-extrabold leading-tight text-brand-navy">
              Watch a Short Ad
              <br />Get <span className="text-brand-pink">1 Extra Try-On!</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">Watch a quick 15–30 second ad and get 1 extra try-on for free!</p>
            <button type="button" onClick={() => setPhase("playing")} className="brand-gradient mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white shadow-lg shadow-brand-pink/25">
              <Play className="size-5" /> Watch Ad Now
            </button>
            <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl border border-border bg-brand-pink-soft/50 px-4 py-2.5 text-left">
              <Clock className="size-5 text-brand-pink" />
              <div className="text-xs text-muted-foreground">
                Your free tries will reset at<br />
                <span className="text-sm font-bold text-brand-navy">{resetLabel()}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} className="mt-4 text-sm font-semibold text-muted-foreground hover:text-brand-navy">Maybe Later</button>
          </>
        ) : (
          <>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-brand-pink">Sponsored</p>
            <div className="mt-2 grid h-40 place-items-center rounded-2xl bg-brand-pink-soft">
              <span className="text-4xl font-extrabold text-brand-navy">{left}s</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Your extra try-on unlocks when the ad ends.</p>
          </>
        )}
      </div>
    </div>
  );
}

/** Green confirmation card shown after the reward is granted. */
export function RewardAddedNotice({ onClose }: { onClose: () => void }) {
  return (
    <div role="status" className="relative mt-5 flex items-center gap-4 rounded-[20px] border border-brand-green/40 bg-brand-green/10 p-4 pr-10">
      <CheckCircle2 className="size-9 shrink-0 text-brand-green" />
      <div className="flex-1">
        <p className="text-base font-extrabold text-brand-navy">Extra Try-On Added!</p>
        <p className="text-sm text-muted-foreground">You now have <b>1</b> more try-on. Enjoy!</p>
      </div>
      <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
        <Clock className="size-3.5" /> Resets at 7:30 PM
      </span>
      <button type="button" onClick={onClose} aria-label="Dismiss" className="absolute right-3 top-3 text-muted-foreground"><X className="size-4" /></button>
    </div>
  );
}
