import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Check, Crown, LogOut, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — TryOnix" }] }),
  component: SettingsPage,
});

const PLANS = [
  { id: "free", name: "Free", price: "$0", credits: "3 credits", features: ["Standard quality", "Try-on history"], cta: "Current" },
  { id: "pro", name: "Pro", price: "$9", credits: "100 credits/mo", features: ["HD 2048px downloads", "Priority queue", "All Free features"], cta: "Upgrade", highlight: true },
  { id: "scale", name: "Scale", price: "$29", credits: "500 credits/mo", features: ["Everything in Pro", "API access (soon)", "Shopify import (soon)"], cta: "Upgrade" },
] as const;

function SettingsPage() {
  const [credits, setCredits] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      setName(u.user.user_metadata?.full_name || "");
      const { data } = await supabase.from("user_credits").select("balance,is_pro").eq("user_id", u.user.id).maybeSingle();
      if (data) { setCredits(data.balance); setIsPro(data.is_pro); }
    })();
  }, []);

  const checkout = (plan: string) => {
    alert(`Checkout for ${plan} plan coming soon. Payments integration is not enabled yet — ask to enable Stripe to activate this flow.`);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <MobileShell>
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="font-bold text-lg">Settings</div>
        <div className="font-bold text-lg text-primary">TryOnix</div>
        <div className="w-10" />
      </header>

      <main className="px-5 flex-1 space-y-5">
        <div className="bg-card border border-border rounded-3xl p-5 flex items-center gap-3">
          <div className="size-12 rounded-full bg-primary-soft grid place-items-center font-bold text-primary">
            {(name || email).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{name || email.split("@")[0]}</div>
            <div className="text-xs text-muted-foreground truncate">{email}</div>
          </div>
          {isPro && <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">PRO</span>}
        </div>

        <div className="bg-gradient-to-br from-primary to-[oklch(0.42_0.18_152)] text-primary-foreground rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Credits balance</div>
              <div className="text-3xl font-bold flex items-center gap-2 mt-1">
                <Zap className="size-6 fill-current" /> {credits}
              </div>
            </div>
            <Crown className="size-10 opacity-30" />
          </div>
        </div>

        <div>
          <h2 className="font-bold text-base mb-3">Plans</h2>
          <div className="space-y-3">
            {PLANS.map(p => (
              <div key={p.id} className={`rounded-3xl p-5 border ${p.highlight ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                <div className="flex items-baseline justify-between">
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="text-2xl font-bold">{p.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{p.credits}</div>
                <ul className="mt-3 space-y-1.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => checkout(p.id)}
                  disabled={p.id === "free"}
                  className={`mt-4 h-11 w-full rounded-full font-semibold text-sm ${p.id === "free" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}
                >
                  {p.id === "free" ? "Current plan" : p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={signOut} className="h-12 w-full rounded-full border border-border bg-card font-semibold inline-flex items-center justify-center gap-2 text-destructive">
          <LogOut className="size-4" /> Sign out
        </button>
      </main>
    </MobileShell>
  );
}
