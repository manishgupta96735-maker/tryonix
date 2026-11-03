import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, ImageIcon, Loader2, Sparkles, UserPlus, Users, Zap } from "lucide-react";
import { PageIntro, PublicPage } from "@/components/SiteChrome";
import { readDailyCredits } from "@/components/Ads";
import { ShareCard } from "@/components/ShareCard";
import { deviceId } from "@/lib/referral";
import { readLedger, type CreditEntry, type CreditKind } from "@/lib/credit-ledger";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/credits")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Credit History — TryOnix" },
      { name: "description", content: "See day by day how many free try-ons you received and used, and who joined through your share link. No sign-up needed." },
      { property: "og:title", content: "Credit History — TryOnix" },
      { property: "og:description", content: "Your free try-on credits, day by day — no account needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Credit History — TryOnix" },
      { name: "twitter:description", content: "Your free try-on credits, day by day — no account needed." },
    ],
  }),
  component: CreditsPage,
});

type ReferralStats = { code?: string; friends?: number; visits?: { d: string; v: string }[] };

const KIND_META: Record<CreditKind, { icon: typeof Zap; label: string }> = {
  daily: { icon: CalendarDays, label: "Daily free try-ons restored" },
  referral: { icon: UserPlus, label: "Referral bonus" },
  tryon: { icon: ImageIcon, label: "Try-on used" },
  visit: { icon: Users, label: "Opened a friend's link" },
};

function dayLabel(d: string): string {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function timeLabel(t: string): string {
  return new Date(t).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function CreditsPage() {
  const [entries, setEntries] = useState<CreditEntry[] | null>(null);
  const [balance, setBalance] = useState(0);
  const [refStats, setRefStats] = useState<ReferralStats | null>(null);

  useEffect(() => {
    setBalance(readDailyCredits());
    setEntries(readLedger());
    const loadRef = async () => {
      try {
        const { data } = await supabase.rpc("referral_history", { _secret: deviceId() });
        setRefStats((data as ReferralStats | null) ?? null);
      } catch {
        setRefStats(null);
      }
    };
    void loadRef();
  }, []);

  const used = (entries ?? []).filter((e) => e.k === "tryon").reduce((s, e) => s + Math.abs(e.a), 0);
  const earned = (entries ?? []).filter((e) => e.a > 0).reduce((s, e) => s + e.a, 0);

  const byDay = new Map<string, CreditEntry[]>();
  for (const e of entries ?? []) {
    const list = byDay.get(e.d) ?? [];
    list.push(e);
    byDay.set(e.d, list);
  }
  const days = [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return (
    <PublicPage>
      <PageIntro
        eyebrow="No sign-up needed"
        title="Your Credit History"
        subtitle="Every free try-on you received and used, day by day — saved only on this device."
      />

      <div className="mx-auto max-w-3xl px-5 pb-4 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] border border-border bg-card p-4 text-center shadow-[var(--shadow-soft)]">
            <Zap className="mx-auto size-5 text-brand-pink" aria-hidden />
            <p className="mt-1.5 text-2xl font-extrabold text-brand-navy">{balance}</p>
            <p className="text-xs font-semibold text-muted-foreground">Try-ons left now</p>
          </div>
          <div className="rounded-[20px] border border-border bg-card p-4 text-center shadow-[var(--shadow-soft)]">
            <ImageIcon className="mx-auto size-5 text-brand-navy" aria-hidden />
            <p className="mt-1.5 text-2xl font-extrabold text-brand-navy">{used}</p>
            <p className="text-xs font-semibold text-muted-foreground">Try-ons used</p>
          </div>
          <div className="rounded-[20px] border border-border bg-card p-4 text-center shadow-[var(--shadow-soft)]">
            <Sparkles className="mx-auto size-5 text-brand-coral" aria-hidden />
            <p className="mt-1.5 text-2xl font-extrabold text-brand-navy">+{earned}</p>
            <p className="text-xs font-semibold text-muted-foreground">Bonus try-ons earned</p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-5 pb-10 sm:px-6">
        {entries === null && (
          <div className="grid place-items-center py-16">
            <Loader2 className="size-6 animate-spin text-brand-pink" />
          </div>
        )}

        {entries !== null && days.length === 0 && (
          <div className="rounded-[24px] border border-border bg-card p-10 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-brand-pink-soft">
              <Sparkles className="size-6 text-brand-pink" aria-hidden />
            </div>
            <p className="mt-3 font-bold text-brand-navy">No credit history yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first try-on and it will show up here.</p>
          </div>
        )}

        {entries !== null && days.length > 0 && (
          <div className="space-y-5">
            {days.map(([day, list]) => (
              <div key={day} className="overflow-hidden rounded-[22px] border border-border bg-card shadow-[var(--shadow-soft)]">
                <p className="border-b border-border bg-secondary/40 px-5 py-3 text-sm font-bold text-brand-navy">
                  {dayLabel(day)}
                </p>
                <ul>
                  {list.map((e, i) => {
                    const meta = KIND_META[e.k];
                    const Icon = meta.icon;
                    const positive = e.a > 0;
                    return (
                      <li key={`${e.t}-${i}`} className={`flex items-center gap-3.5 px-5 py-3.5 ${i > 0 ? "border-t border-border/70" : ""}`}>
                        <span className={`grid size-9 shrink-0 place-items-center rounded-full ${positive ? "bg-brand-pink-soft" : "bg-secondary"}`}>
                          <Icon className={`size-4 ${positive ? "text-brand-pink" : "text-brand-navy"}`} aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-brand-navy">{e.n || meta.label}</p>
                          <p className="text-xs text-muted-foreground">{timeLabel(e.t)}</p>
                        </div>
                        <span className={`text-sm font-extrabold ${positive ? "text-brand-pink" : e.a < 0 ? "text-brand-navy" : "text-muted-foreground"}`}>
                          {e.a > 0 ? `+${e.a}` : e.a < 0 ? String(e.a) : "—"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-[24px] border border-brand-pink/25 bg-brand-pink-soft/40 p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white shadow-sm">
              <Users className="size-5 text-brand-pink" aria-hidden />
            </span>
            <div>
              <p className="text-[15px] font-bold text-brand-navy">Friends who joined through your link</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Every friend who opens your share link adds +2 try-ons to this page. Friends stay anonymous — only the day is shown.
              </p>
            </div>
          </div>

          {refStats === null ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading your link…</p>
          ) : (refStats.visits?.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No friends have joined yet — share your link below.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {refStats.visits!.map((v, i) => (
                <li key={v.v + v.d} className="flex items-center justify-between rounded-[14px] bg-card px-4 py-2.5 text-sm">
                  <span className="font-semibold text-brand-navy">Friend {refStats!.visits!.length - i}</span>
                  <span className="text-muted-foreground">{dayLabel(v.d)}</span>
                  <span className="font-bold text-brand-pink">+2</span>
                </li>
              ))}
            </ul>
          )}

          <ShareCard />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This history lives only on your device — clearing browser data removes it. No account is needed or stored.
        </p>
      </section>
    </PublicPage>
  );
}
