import { useState } from "react";
import { Copy, MessageCircle, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { getReferralLink, REFERRAL_REWARD } from "@/lib/referral";

const MESSAGE = "See any outfit on yourself for free with TryOnix AI 👗✨";

export function ShareCard() {
  const [copied, setCopied] = useState(false);
  const withLink = async (fn: (link: string) => void | Promise<void>) => {
    try { await fn(await getReferralLink()); } catch { toast.error("Couldn't create your link. Please try again."); }
  };

  return (
    <div className="mt-4 rounded-[18px] border border-brand-pink/25 bg-brand-pink-soft/50 p-4">
      <p className="text-[15px] font-bold text-brand-navy">Share TryOnix, get +{REFERRAL_REWARD} try-ons</p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Every friend who opens your link gives you {REFERRAL_REWARD} extra try-ons.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => withLink((l) => { window.open(`https://wa.me/?text=${encodeURIComponent(`${MESSAGE} ${l}`)}`, "_blank", "noopener"); })}
          className="brand-gradient inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary-foreground shadow-md">
          <MessageCircle className="size-4" /> WhatsApp
        </button>
        <button type="button" onClick={() => withLink(async (l) => { await navigator.clipboard.writeText(l); setCopied(true); toast.success("Link copied!"); setTimeout(() => setCopied(false), 2000); })}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy link"}
        </button>
        <button type="button" onClick={() => withLink(async (l) => {
          if (navigator.share) { try { await navigator.share({ title: "TryOnix", text: MESSAGE, url: l }); } catch { /* cancelled */ } }
          else { await navigator.clipboard.writeText(l); toast.success("Link copied!"); }
        })}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
          <Share2 className="size-4" /> More
        </button>
      </div>
    </div>
  );
}
