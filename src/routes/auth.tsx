import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { Loader2, ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in — TryOnix" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    if (!email || password.length < 6) {
      setErr("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/app" },
      });
      setLoading(false);
      if (error) return setErr(error.message);
      setInfo("Check your inbox to confirm your email, then sign in.");
      setMode("signin");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    navigate({ to: "/app" });
  };

  const handleQuickSignIn = async () => {
    setErr(null);
    setOauthLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app",
    });
    if (result.error) {
      setOauthLoading(false);
      setErr("Unable to sign in. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen flex flex-col px-6 pt-6 pb-8">
        <div className="flex items-center">
          <Link to="/" className="size-10 rounded-full bg-card border border-border grid place-items-center">
            <ArrowLeft className="size-4" />
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center text-center pt-6">
          <div className="size-24 rounded-full bg-primary-soft grid place-items-center mb-5 overflow-hidden">
            <img src={mascotAsset.url} alt="TryOnix" className="size-24 object-cover" />
          </div>

          <h1 className="text-2xl font-bold text-primary">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-[300px]">
            {mode === "signin"
              ? "Sign in to continue your TryOnix journey."
              : "Join TryOnix and start trying outfits in seconds."}
          </p>

          <button
            onClick={handleQuickSignIn}
            disabled={oauthLoading || loading}
            className="mt-7 w-full h-14 rounded-full bg-card border border-border font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-50"
          >
            {oauthLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span className="size-6 rounded-full bg-primary-soft grid place-items-center">
                <Sparkles className="size-3.5 text-primary" />
              </span>
            )}
            <span className="text-sm">Quick Sign-In</span>
          </button>

          <div className="my-5 flex items-center gap-3 w-full">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">or with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="w-full space-y-3 text-left">
            <div className="h-14 rounded-2xl border border-border bg-card flex items-center px-4">
              <Mail className="size-4 text-muted-foreground mr-2" />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-base font-medium"
              />
            </div>
            <div className="h-14 rounded-2xl border border-border bg-card flex items-center px-4">
              <Lock className="size-4 text-muted-foreground mr-2" />
              <input
                type={showPwd ? "text" : "password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-base font-medium"
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-muted-foreground">
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {err && <p className="text-sm text-destructive">{err}</p>}
            {info && <p className="text-sm text-primary">{info}</p>}

            <button
              type="submit"
              disabled={loading || oauthLoading}
              className="h-14 w-full rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_oklch(0.52_0.16_152/0.5)] active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); setInfo(null); }}
            className="mt-5 text-sm text-muted-foreground"
          >
            {mode === "signin" ? (
              <>New to TryOnix? <span className="text-primary font-semibold">Create account</span></>
            ) : (
              <>Already have an account? <span className="text-primary font-semibold">Sign in</span></>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          By continuing, you agree to TryOnix's <span className="text-primary underline">Terms</span> and <span className="text-primary underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
