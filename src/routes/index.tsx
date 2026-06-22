import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Sparkles, Wand2, Shield, Smartphone, Zap, Crown, Camera, Download } from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";
import demoPerson from "@/assets/demo-person.jpg";
import demoOutfit from "@/assets/demo-outfit.jpg";
import demoResult from "@/assets/demo-result.jpg";
import { supabase } from "@/integrations/supabase/client";
const mascot = mascotAsset.url;

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TryOnix — See Yourself in Any Outfit" },
      { name: "description", content: "Virtual try-on app. Upload your photo and any outfit to instantly see how it looks on you." },
    ],
  }),
  component: App,
});

type Screen = "onboard" | "language" | "welcome" | "features" | "how" | "ready";

const ORDER: Screen[] = ["onboard", "language", "welcome", "features", "how", "ready"];

function App() {
  const [screen, setScreen] = useState<Screen>("onboard");
  const [lang, setLang] = useState("en");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  const idx = ORDER.indexOf(screen);
  const next = () => setScreen(ORDER[Math.min(idx + 1, ORDER.length - 1)]);
  const goAuth = () => navigate({ to: "/auth" });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-background relative flex flex-col">
        {screen !== "onboard" && <Progress idx={idx} total={ORDER.length} />}
        {screen === "onboard" && <Onboard onNext={next} />}
        {screen === "language" && <Language value={lang} onChange={setLang} onNext={next} />}
        {screen === "welcome" && <Welcome onNext={next} />}
        {screen === "features" && <Features onNext={next} />}
        {screen === "how" && <HowItWorks onNext={next} />}
        {screen === "ready" && <Ready onNext={goAuth} />}
      </div>
    </div>
  );
}

function Progress({ idx, total }: { idx: number; total: number }) {
  return (
    <div className="px-6 pt-6 flex gap-1.5">
      {Array.from({ length: total - 1 }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full ${i < idx ? "bg-primary" : "bg-muted"}`} />
      ))}
    </div>
  );
}

function PrimaryButton({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...p}
      className="h-14 w-full rounded-full bg-primary text-primary-foreground font-semibold text-base inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_oklch(0.52_0.16_152/0.5)] active:scale-[0.98] transition disabled:opacity-50"
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
        <div className="size-44 rounded-full bg-primary-soft grid place-items-center mb-6 overflow-hidden">
          <img src={mascot} alt="TryOnix mascot" className="size-44 object-cover" />
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

      <PrimaryButton onClick={onNext}>Get Started <ArrowRight className="size-4" /></PrimaryButton>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        By continuing, you agree to our <span className="text-primary underline">Terms of Service</span>
      </p>
    </div>
  );
}

function Language({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  const langs = [
    { code: "en", name: "English", sub: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", sub: "Hindi", flag: "🇮🇳" },
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
    <div className="flex-1 flex flex-col px-6 pt-6 pb-6 fade-up">
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
    <div className="flex-1 flex flex-col px-6 pt-6 pb-6 fade-up">
      <div className="flex flex-col items-center text-center">
        <div className="size-28 rounded-full bg-primary-soft grid place-items-center mb-4">
          <img src={mascot} alt="" className="size-24 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-primary leading-tight">Welcome to<br />TryOnix!</h1>
        <p className="mt-3 text-sm text-muted-foreground">Your Personal Virtual<br />Try-On Assistant</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="grid grid-cols-2 gap-3 w-full">
          <DemoCard label="Your image" src={demoPerson} />
          <DemoCard label="Your outfit" src={demoOutfit} />
        </div>
        <div className="my-4 h-10 w-px border-l-2 border-dashed border-primary/40" />
        <div className="w-1/2">
          <DemoCard label="This is how it looks on you" tall src={demoResult} />
        </div>
      </div>

      <PrimaryButton onClick={onNext}>Continue <ArrowRight className="size-4" /></PrimaryButton>
    </div>
  );
}

function DemoCard({ label, tall, src }: { label: string; tall?: boolean; src: string }) {
  return (
    <div className={`relative rounded-2xl border border-border overflow-hidden ${tall ? "aspect-[3/4]" : "aspect-square"} shadow-sm bg-card`}>
      <img src={src} alt={label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <span className="absolute top-2 left-2 text-[10px] font-semibold bg-card/95 backdrop-blur px-2 py-1 rounded-full shadow-sm">{label}</span>
    </div>
  );
}

function Features({ onNext }: { onNext: () => void }) {
  const cards = [
    { title: "AI Try-On", desc: "Upload your photo and outfit image to instantly see how it will look on you.", bg: "bg-[oklch(0.65_0.18_280)]", icon: Sparkles },
    { title: "AI Outfit Editor", desc: "Change or add any outfit piece with text. Describe changes and watch your style transform.", bg: "bg-[oklch(0.62_0.18_240)]", icon: Wand2 },
    { title: "AI Edit", desc: "Write prompts or use ready-made templates to edit images exactly the way you want.", bg: "bg-[oklch(0.68_0.18_50)]", icon: Zap },
  ];
  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-6 fade-up">
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
        <PrimaryButton onClick={onNext}>Continue <ArrowRight className="size-4" /></PrimaryButton>
      </div>
    </div>
  );
}

function HowItWorks({ onNext }: { onNext: () => void }) {
  const steps = [
    { Icon: Camera, title: "Upload your photo", desc: "Choose a clear, full-body shot of yourself." },
    { Icon: Shirt, title: "Pick an outfit", desc: "Upload any clothing image or paste a product link." },
    { Icon: Sparkles, title: "Generate", desc: "Our AI fits the outfit on you in seconds." },
    { Icon: Download, title: "Save & Share", desc: "Download in HD or share with friends instantly." },
  ];
  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-6 fade-up">
      <div className="flex flex-col items-center text-center">
        <div className="size-24 rounded-full bg-primary-soft grid place-items-center mb-3">
          <img src={mascot} alt="" className="size-20 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-primary">How it Works</h1>
        <p className="mt-1 text-sm text-muted-foreground">4 simple steps to your new look</p>
      </div>

      <div className="mt-6 space-y-3 flex-1">
        {steps.map(({ Icon, title, desc }, i) => (
          <div key={title} className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className="size-10 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold shrink-0">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <div className="font-semibold text-sm">{title}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <PrimaryButton onClick={onNext}>Continue <ArrowRight className="size-4" /></PrimaryButton>
    </div>
  );
}

function Shirt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

function Ready({ onNext }: { onNext: () => void }) {
  const perks = [
    { Icon: Crown, label: "3 free try-ons to start" },
    { Icon: Shield, label: "Your data stays private & secure" },
    { Icon: Smartphone, label: "Works across all your devices" },
  ];
  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-6 fade-up">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="size-40 rounded-full bg-primary-soft grid place-items-center mb-6 overflow-hidden">
          <img src={mascot} alt="" className="size-40 object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">You're all set!</h1>
        <p className="mt-3 text-muted-foreground text-sm max-w-[280px]">
          Create your TryOnix account in seconds and start trying on outfits.
        </p>

        <div className="mt-8 w-full rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm">
          {perks.map(({ Icon, label }) => (
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

      <PrimaryButton onClick={onNext}>Create Account <ArrowRight className="size-4" /></PrimaryButton>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Quick sign-in or email — your choice.
      </p>
    </div>
  );
}
