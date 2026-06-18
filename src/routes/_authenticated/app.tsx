import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Download, Loader2, ImageIcon, Shirt, Zap, Plus, RefreshCw, Crown, LogOut,
} from "lucide-react";
import { MobileShell } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({ meta: [{ title: "Try On — TryOnix" }] }),
  component: AppPage,
});

type ErrKind = "rate" | "credits" | "auth" | "other";

function AppPage() {
  const [personImg, setPersonImg] = useState<string | null>(null);
  const [clothImg, setClothImg] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [errKind, setErrKind] = useState<ErrKind | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isPro, setIsPro] = useState(false);
  const [hd, setHd] = useState(false);
  const [name, setName] = useState<string>("");

  const loadProfile = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setName(u.user.user_metadata?.full_name || u.user.email || "");
    const { data } = await supabase
      .from("user_credits")
      .select("balance,is_pro")
      .eq("user_id", u.user.id)
      .maybeSingle();
    if (data) {
      setCredits(data.balance);
      setIsPro(data.is_pro);
    }
  };
  useEffect(() => { void loadProfile(); }, []);

  const generate = async () => {
    if (!personImg || !clothImg || loading) return;
    setLoading(true);
    setResult(null);
    setErrMsg(null);
    setErrKind(null);
    try {
      const { data: s } = await supabase.auth.getSession();
      const token = s.session?.access_token;
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ personImage: personImg, clothImage: clothImg, hd: hd && isPro }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) { setErrKind("rate"); throw new Error(data.error || "Rate limit hit. Please wait a moment."); }
        if (res.status === 402) { setErrKind("credits"); throw new Error(data.error || "You're out of credits."); }
        if (res.status === 401) { setErrKind("auth"); throw new Error("Please sign in again."); }
        setErrKind("other");
        throw new Error(data.error || "Generation failed");
      }
      setResult(data.image);
      setCredits(data.creditsRemaining ?? Math.max(0, credits - 1));
    } catch (e: any) {
      setErrMsg(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <MobileShell>
      <header className="px-5 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-primary-soft grid place-items-center text-xs font-bold text-primary">
            {name.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-xs">
            <div className="text-muted-foreground">Hello</div>
            <div className="font-semibold text-sm truncate max-w-[140px]">{name.split(" ")[0] || "there"}</div>
          </div>
        </div>
        <div className="font-bold text-lg text-primary">TryOnix</div>
        <div className="flex items-center gap-1 bg-card border border-border rounded-full px-3 h-10">
          <Zap className="size-4 text-[oklch(0.72_0.17_70)] fill-[oklch(0.72_0.17_70)]" />
          <span className="text-sm font-bold">{credits}</span>
        </div>
      </header>

      <main className="px-5 flex-1 space-y-5">
        <UploadCard label="Image" hint="Tap to choose from camera or gallery" icon={ImageIcon} value={personImg} onChange={setPersonImg} placeholder="Select Your Image" />
        <UploadCard label="Outfit Image" hint="Tap to choose from camera or gallery" icon={Shirt} value={clothImg} onChange={setClothImg} placeholder="Select Outfit" />

        <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary-soft grid place-items-center">
              <Crown className="size-4 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">HD output (2048px)</div>
              <div className="text-xs text-muted-foreground">{isPro ? "Pro enabled" : "Pro only — upgrade in Settings"}</div>
            </div>
          </div>
          <button
            disabled={!isPro}
            onClick={() => setHd(v => !v)}
            className={`h-6 w-11 rounded-full transition relative ${hd && isPro ? "bg-primary" : "bg-muted"} disabled:opacity-40`}
          >
            <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${hd && isPro ? "left-5" : "left-0.5"}`} />
          </button>
        </div>

        <div className="pt-1">
          <button
            onClick={generate}
            disabled={!personImg || !clothImg || loading || credits <= 0}
            className="h-14 w-full rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_oklch(0.52_0.16_152/0.5)] disabled:opacity-40 active:scale-[0.98] transition"
          >
            {loading ? <><Loader2 className="size-4 animate-spin" /> Generating…</> : <><Sparkles className="size-4" /> Generate Try-On (1 credit)</>}
          </button>
          {credits <= 0 && !loading && (
            <Link to="/settings" className="mt-3 block text-center text-sm text-primary font-semibold underline">
              You're out of credits — upgrade to Pro
            </Link>
          )}
          {errMsg && (
            <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-center">
              <p className="text-sm font-semibold text-destructive">{errMsg}</p>
              {errKind === "credits" ? (
                <Link to="/settings" className="mt-3 inline-block h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold leading-10">
                  Get more credits
                </Link>
              ) : (
                <button onClick={generate} className="mt-3 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-card border border-border text-sm font-semibold">
                  <RefreshCw className="size-3.5" /> Retry
                </button>
              )}
            </div>
          )}
        </div>

        {(loading || result) && (
          <div className="pt-3">
            <h2 className="font-bold text-base mb-3">Result</h2>
            <div className="rounded-3xl border border-border overflow-hidden aspect-[3/4] bg-muted relative">
              {loading && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <Loader2 className="size-8 animate-spin mx-auto text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">AI is fitting your outfit…</p>
                  </div>
                </div>
              )}
              {result && !loading && <img src={result} alt="Try-on" className="w-full h-full object-cover" />}
            </div>
            {result && !loading && (
              <a href={result} download={`tryonix-${Date.now()}.jpg`} className="mt-3 h-12 rounded-full border border-border bg-card font-semibold inline-flex items-center justify-center gap-2 w-full">
                <Download className="size-4" /> Download {hd && isPro ? "HD" : ""}
              </a>
            )}
          </div>
        )}

        <button onClick={signOut} className="text-xs text-muted-foreground flex items-center gap-1 mx-auto pt-4">
          <LogOut className="size-3" /> Sign out
        </button>
      </main>
    </MobileShell>
  );
}

function UploadCard({
  label, hint, icon: Icon, value, onChange, placeholder,
}: { label: string; hint: string; icon: any; value: string | null; onChange: (v: string | null) => void; placeholder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const pick = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(file);
  };
  return (
    <div>
      <div
        onClick={() => ref.current?.click()}
        className="aspect-[5/3] rounded-3xl border border-border bg-card cursor-pointer overflow-hidden relative grid place-items-center shadow-sm"
      >
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => pick(e.target.files?.[0] ?? undefined)} />
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center px-6">
            <div className="size-14 mx-auto rounded-full bg-primary-soft grid place-items-center mb-2 relative">
              <Icon className="size-6 text-primary" />
              <div className="absolute -right-1 -bottom-1 size-6 rounded-full bg-primary grid place-items-center border-2 border-card">
                <Plus className="size-3 text-primary-foreground" />
              </div>
            </div>
            <div className="font-semibold text-sm">{placeholder}</div>
            <div className="text-xs text-muted-foreground mt-1">{hint}</div>
          </div>
        )}
      </div>
      <p className="text-center mt-2 text-sm font-semibold">{label}</p>
    </div>
  );
}
