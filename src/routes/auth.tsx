import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — TryOnix" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  const signIn = async () => {
    setErr(null);
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app",
    });
    if (result.error) {
      setErr(result.error.message || "Sign in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen flex flex-col px-6 pt-12 pb-8">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="size-44 rounded-full bg-primary-soft grid place-items-center mb-6 overflow-hidden">
            <img src={mascotAsset.url} alt="TryOnix" className="size-44 object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Welcome to TryOnix</h1>
          <p className="mt-3 text-muted-foreground text-sm max-w-[280px]">
            Sign in to save your try-ons, manage credits, and access your history.
          </p>
        </div>

        <button
          onClick={signIn}
          disabled={loading}
          className="h-14 rounded-full border border-border bg-card font-semibold inline-flex items-center justify-center gap-3 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
          {loading ? "Signing in…" : "Continue with Google"}
        </button>
        {err && <p className="mt-3 text-center text-sm text-destructive">{err}</p>}
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          By continuing, you agree to our <span className="text-primary underline">Terms</span>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.4-1.7 4.1-5.4 4.1-3.3 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.7 14.6 2.8 12 2.8c-5 0-9 4-9 9s4 9 9 9c5.2 0 8.6-3.7 8.6-8.8 0-.6-.1-1-.2-1.5H12z" />
    </svg>
  );
}
