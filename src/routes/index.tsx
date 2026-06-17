import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Sparkles, Wand2, Image as ImageIcon, Shield, Zap, Smartphone } from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";
const mascot = mascotAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TryOnix — See Yourself in Any Outfit" },
      { name: "description", content: "Virtual try-on app. Upload your photo and any outfit to instantly see how it looks on you." },
    ],
  }),
  component: App,
});

type Screen = "onboard" | "language" | "welcome" | "features";

function App() {
  const [screen, setScreen] = useState<Screen>("onboard");
  const [lang, setLang] = useState("en");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-background relative flex flex-col">
        {screen === "onboard" && <Onboard onNext={() => setScreen("language")} />}
        {screen === "language" && <Language value={lang} onChange={setLang} onNext={() => setScreen("welcome")} />}
        {screen === "welcome" && <Welcome onNext={() => setScreen("features")} />}
        {screen === "features" && <Features />}
      </div>
    </div>
  );
}

function PrimaryButton({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...p}
      className="h-14 w-full rounded-full bg-primary text-primary-foreground font-semibold text-base inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_oklch(0.52_0.16_152/0.5)] active:scale-[0.98] transition"
    >
      {children}
    </button>
  );
}

function Onboard({ onNext }: { onNext: () => void }) {
  const bullets = [
    { label: "Virtual Try-On in Seconds", Icon: Sparkles },
    { label: "Realistic AI Photo Editing", Icon: Wand2 },
    { label: "Sync Across All Devices", Icon: Smartphone },
    { label: "Secure & Private", Icon: Shield },
  ];
  return (
    <div className="flex-1 flex flex-col px-6 pt-12 pb-8 fade-up">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="size-44 rounded-full bg-primary-soft grid place-items-center mb-6">
          <img src={mascot} alt="TryOnix mascot" className="size-40 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">See Yourself in Any Outfit</h1>
        <p className="mt-3 text-muted-foreground text-sm max-w-[260px]">
          Try new looks, outfits, and trendy styles in seconds.
        </p>

        <div className="mt-8 w-full rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm">
          {bullets.map(({ label, Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary-soft grid place-items-center">
                <Icon className="size-4 text-primary" />
              </div>
              <span className="text-sm font-medium flex-1 text-left">{label}</span>
              <Check className="size-4 text-primary" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-6 h-14 rounded-full border border-border bg-card font-semibold inline-flex items-center justify-center gap-3 active:scale-[0.98] transition"
      >
        <GoogleIcon /> Continue with Google
      </button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        By continuing, you agree to our <span className="text-primary underline">Terms of Service</span>
      </p>
    </div>
  );
}

function Language({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  const langs = [
    { code: "en", name: "English", sub: "English", flag: "🌐" },
    { code: "fr", name: "Français", sub: "French", flag: "🇫🇷" },
    { code: "ja", name: "日本語", sub: "Japanese", flag: "🇯🇵" },
    { code: "es", name: "Español", sub: "Spanish", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", sub: "German", flag: "🇩🇪" },
    { code: "it", name: "Italiano", sub: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Português (Brasil)", sub: "Portuguese (Brazil)", flag: "🇧🇷" },
    { code: "ko", name: "한국어", sub: "Korean", flag: "🇰🇷" },
    { code: "ar", name: "العربية", sub: "Arabic", flag: "🇸🇦" },
    { code: "id", name: "Bahasa Indonesia", sub: "Indonesian", flag: "🇮🇩" },
    { code: "tr", name: "Türkçe", sub: "Turkish", flag: "🇹🇷" },
  ];
  return (
    <div className="flex-1 flex flex-col px-6 pt-10 pb-6 fade-up">
      <div className="flex flex-col items-center text-center">
        <div className="size-24 rounded-full bg-primary-soft grid place-items-center mb-4">
          <img src={mascot} alt="" className="size-20 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-primary">Select Language</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose your preferred language</p>
      </div>

      <div className="mt-6 space-y-2.5 overflow-y-auto flex-1">
        {langs.map((l) => {
          const active = value === l.code;
          return (
            <button
              key={l.code}
              onClick={() => onChange(l.code)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition text-left ${
                active ? "bg-primary-soft border-primary" : "bg-card border-border"
              }`}
            >
              <div className="size-10 rounded-full bg-muted grid place-items-center text-lg shrink-0">{l.flag}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{l.name}</div>
                <div className="text-xs text-muted-foreground truncate">{l.sub}</div>
              </div>
              {active && (
                <div className="size-6 rounded-full bg-primary grid place-items-center shrink-0">
                  <Check className="size-3.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={onNext}>Continue <ArrowRight className="size-4" /></PrimaryButton>
      </div>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-10 pb-6 fade-up">
      <div className="flex flex-col items-center text-center">
        <div className="size-28 rounded-full bg-primary-soft grid place-items-center mb-4">
          <img src={mascot} alt="" className="size-24 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-primary leading-tight">Welcome to<br />TryOnix!</h1>
        <p className="mt-3 text-sm text-muted-foreground">Your Personal Virtual<br />Try-On Assistant</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="grid grid-cols-2 gap-3 w-full">
          <DemoCard label="Your image" tone="bg-muted" />
          <DemoCard label="Your outfit" tone="bg-accent" />
        </div>
        <div className="my-4 h-10 w-px border-l-2 border-dashed border-primary/40" />
        <div className="w-1/2">
          <DemoCard label="This is how it looks on you" tall tone="bg-primary-soft" />
        </div>
      </div>

      <PrimaryButton onClick={onNext}>Get Started <ArrowRight className="size-4" /></PrimaryButton>
    </div>
  );
}

function DemoCard({ label, tall, tone }: { label: string; tall?: boolean; tone: string }) {
  return (
    <div className={`rounded-2xl border border-border ${tone} ${tall ? "aspect-[3/4]" : "aspect-square"} p-3 flex flex-col justify-between shadow-sm`}>
      <span className="text-[10px] font-semibold bg-card px-2 py-1 rounded-full self-start shadow-sm">{label}</span>
      <div className="grid place-items-center flex-1">
        <ImageIcon className="size-8 text-muted-foreground/40" />
      </div>
    </div>
  );
}

function Features() {
  const cards = [
    { title: "AI Try-On", desc: "Upload your photo and outfit image to instantly see how it will look on you.", bg: "bg-[oklch(0.65_0.18_280)]", icon: Sparkles },
    { title: "AI Outfit Editor", desc: "Change or add any outfit piece with text. Describe changes and watch your style transform.", bg: "bg-[oklch(0.62_0.18_240)]", icon: Wand2 },
    { title: "AI Edit", desc: "Write prompts or use ready-made templates to edit images exactly the way you want.", bg: "bg-[oklch(0.68_0.18_50)]", icon: Zap },
  ];
  return (
    <div className="flex-1 flex flex-col px-6 pt-10 pb-6 fade-up">
      <div className="flex flex-col items-center text-center">
        <div className="size-24 rounded-full bg-primary-soft grid place-items-center mb-3">
          <img src={mascot} alt="" className="size-20 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-primary leading-tight">TryOnix<br />Features</h1>
        <p className="mt-2 text-sm text-muted-foreground">See all what you can do with TryOnix</p>
      </div>

      <div className="mt-6 space-y-4 flex-1 overflow-y-auto">
        {cards.map(({ title, desc, bg, icon: Icon }) => (
          <div key={title} className={`${bg} rounded-3xl p-5 text-white relative overflow-hidden min-h-[140px]`}>
            <div className="inline-flex items-center gap-1.5 bg-white/95 text-foreground text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              <Icon className="size-3.5 text-primary" /> {title}
            </div>
            <p className="text-sm leading-relaxed pr-28">{desc}</p>
            <div className="absolute right-4 bottom-4 w-20 h-24 rounded-2xl bg-white/20 backdrop-blur-sm grid place-items-center">
              <Icon className="size-7 text-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link to="/try-on" className="block">
          <PrimaryButton>Get Started <ArrowRight className="size-4" /></PrimaryButton>
        </Link>
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
