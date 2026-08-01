import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { Loader2, ArrowLeft, User, Lock, Eye, EyeOff, Check } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create your Premium account — TryOnix" },
      { name: "description", content: "Create a TryOnix Premium account with a username and password to unlock 85 AI try-ons every month." },
      { property: "og:title", content: "Create your TryOnix Premium account" },
      { property: "og:description", content: "Username and password only. 85 try-ons every month, no daily limit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const USERNAME_DOMAIN = "tryonix.app";
const normalize = (u: string) => u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const u = normalize(username);
    if (u.length < 3) return setErr("Username must be at least 3 characters (letters, numbers, . _ -).");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");

    setLoading(true);
    const email = `${u}@${USERNAME_DOMAIN}`;
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: u } },
      });
      setLoading(false);
      if (error) {
        return setErr(
          /already registered|already exists/i.test(error.message)
            ? "That username is taken. Try another one."
            : error.message,
        );
      }
      navigate({ to: "/" });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr("Wrong username or password.");
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen justify-center bg-background text-foreground">
      <div className="flex w-full max-w-[440px] flex-col px-6 pb-10 pt-6">
        <Link to="/" className="grid size-10 place-items-center rounded-full border border-border bg-card">
          <ArrowLeft className="size-4" />
        </Link>

        <div className="flex flex-1 flex-col items-center pt-8 text-center">
          <img src={mascotAsset.url} alt="TryOnix" className="size-20 rounded-2xl object-cover" />
          <h1 className="mt-5 text-[26px] font-extrabold tracking-tight">
            {mode === "signup" ? "Create your Premium account" : "Welcome back"}
          </h1>
          <p className="mt-2 max-w-[320px] text-sm text-muted-foreground">
            {mode === "signup"
              ? "Just a username and password — no email needed. Free try-ons never require an account."
              : "Sign in with your username and password."}
          </p>

          {mode === "signup" && (
            <ul className="mt-6 w-full space-y-2 rounded-[20px] border border-border bg-card p-5 text-left text-sm">
              {["85 try-ons every month", "No daily limit", "HD downloads, no watermark", "Saved try-on history"].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="size-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={submit} className="mt-6 w-full space-y-3 text-left">
            <div className="flex h-14 items-center rounded-2xl border border-border bg-card px-4">
              <User className="mr-2 size-4 text-muted-foreground" />
              <input
                type="text"
                autoComplete="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent text-base font-medium outline-none"
              />
            </div>
            <div className="flex h-14 items-center rounded-2xl border border-border bg-card px-4">
              <Lock className="mr-2 size-4 text-muted-foreground" />
              <input
                type={showPwd ? "text" : "password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-base font-medium outline-none"
              />
              <button type="button" aria-label="Toggle password" onClick={() => setShowPwd((v) => !v)} className="text-muted-foreground">
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {err && <p className="text-sm font-medium text-destructive">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-glow inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setErr(null); }}
            className="mt-5 text-sm text-muted-foreground"
          >
            {mode === "signup" ? (
              <>Already have an account? <span className="font-semibold text-primary">Sign in</span></>
            ) : (
              <>Need Premium? <span className="font-semibold text-primary">Create account</span></>
            )}
          </button>

          <p className="mt-6 text-[12px] text-muted-foreground">
            Payment isn’t enabled yet — accounts created now get Premium access at launch.
          </p>
        </div>
      </div>
    </div>
  );
}

