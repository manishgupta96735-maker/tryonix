import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { Loader2, ArrowLeft, Phone, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in — TryOnix" }] }),
  component: AuthPage,
});

const COUNTRIES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "Korea" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
];

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const fullPhone = `${country.code}${phone.replace(/\D/g, "")}`;

  const sendOtp = async () => {
    setErr(null);
    if (phone.replace(/\D/g, "").length < 6) {
      setErr("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setStep("otp");
    setResendIn(45);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const verifyOtp = async (code: string) => {
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: code, type: "sms" });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    navigate({ to: "/app" });
  };

  const onOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every((d) => d) && next.join("").length === 6) verifyOtp(next.join(""));
  };

  const onOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const onOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (txt.length === 6) {
      e.preventDefault();
      setOtp(txt.split(""));
      verifyOtp(txt);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen flex flex-col px-6 pt-6 pb-8">
        <div className="flex items-center">
          {step === "otp" ? (
            <button onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); setErr(null); }} className="size-10 rounded-full bg-card border border-border grid place-items-center">
              <ArrowLeft className="size-4" />
            </button>
          ) : (
            <Link to="/" className="size-10 rounded-full bg-card border border-border grid place-items-center">
              <ArrowLeft className="size-4" />
            </Link>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center text-center pt-6">
          <div className="size-28 rounded-full bg-primary-soft grid place-items-center mb-5 overflow-hidden">
            <img src={mascotAsset.url} alt="TryOnix" className="size-28 object-cover" />
          </div>

          {step === "phone" ? (
            <>
              <h1 className="text-2xl font-bold text-primary">Enter your number</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-[300px]">
                We'll send a 6-digit code to verify your phone number.
              </p>

              <div className="mt-8 w-full">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone number</label>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setShowPicker((v) => !v)}
                    className="h-14 px-4 rounded-2xl border border-border bg-card font-semibold inline-flex items-center gap-2 shrink-0"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-sm">{country.code}</span>
                  </button>
                  <div className="h-14 flex-1 rounded-2xl border border-border bg-card flex items-center px-4">
                    <Phone className="size-4 text-muted-foreground mr-2" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoFocus
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-base font-medium"
                    />
                  </div>
                </div>

                {showPicker && (
                  <div className="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card divide-y divide-border">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code + c.name}
                        onClick={() => { setCountry(c); setShowPicker(false); }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted text-left"
                      >
                        <span className="text-xl">{c.flag}</span>
                        <span className="flex-1 text-sm font-medium">{c.name}</span>
                        <span className="text-sm text-muted-foreground">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}

                {err && <p className="mt-3 text-sm text-destructive text-left">{err}</p>}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-primary">Verify your number</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-foreground">{fullPhone}</span>
              </p>

              <div className="mt-8 w-full">
                <div className="flex gap-2 justify-between">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => onOtpChange(i, e.target.value)}
                      onKeyDown={(e) => onOtpKey(i, e)}
                      onPaste={onOtpPaste}
                      className="size-12 rounded-2xl border border-border bg-card text-center text-xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  ))}
                </div>

                {err && <p className="mt-3 text-sm text-destructive text-left">{err}</p>}

                <div className="mt-5 text-center text-sm">
                  {resendIn > 0 ? (
                    <span className="text-muted-foreground">Resend code in {resendIn}s</span>
                  ) : (
                    <button onClick={sendOtp} className="text-primary font-semibold">Resend code</button>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" />
                  Secured by end-to-end verification
                </div>
              </div>
            </>
          )}
        </div>

        {step === "phone" && (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="h-14 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_oklch(0.52_0.16_152/0.5)] active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Sending..." : "Send Code"}
          </button>
        )}
        {step === "otp" && loading && (
          <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
            <Loader2 className="size-4 animate-spin" /> Verifying...
          </div>
        )}

        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          By continuing, you agree to our <span className="text-primary underline">Terms</span> and <span className="text-primary underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
