import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Sparkles, Download, ArrowLeft, Loader2, ImageIcon, Shirt, Home, Wand2, Images, Settings as SettingsIcon, Zap, Plus } from "lucide-react";

export const Route = createFileRoute("/try-on")({
  head: () => ({
    meta: [
      { title: "Try On — TryOnix" },
      { name: "description", content: "Upload your photo and a clothing item to see AI virtual try-on." },
    ],
  }),
  component: TryOn,
});

function TryOn() {
  const [personImg, setPersonImg] = useState<string | null>(null);
  const [clothImg, setClothImg] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits] = useState(3);

  const generate = async () => {
    if (!personImg || !clothImg) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personImage: personImg, clothImage: clothImg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.image);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen flex flex-col relative pb-28">
        <header className="px-5 pt-5 pb-4 flex items-center justify-between">
          <Link to="/" className="size-10 rounded-full bg-card border border-border grid place-items-center">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="font-bold text-lg text-primary">TryOnix</div>
          <div className="flex items-center gap-1 bg-card border border-border rounded-full px-3 h-10">
            <Zap className="size-4 text-[oklch(0.72_0.17_70)] fill-[oklch(0.72_0.17_70)]" />
            <span className="text-sm font-bold">{credits}</span>
          </div>
        </header>

        <main className="px-5 flex-1 space-y-5">
          <UploadCard label="Image" hint="Tap to choose from camera or gallery" icon={ImageIcon} value={personImg} onChange={setPersonImg} placeholder="Select Your Image" />
          <UploadCard label="Outfit Image" hint="Tap to choose from camera or gallery" icon={Shirt} value={clothImg} onChange={setClothImg} placeholder="Select Outfit" />

          <div className="pt-2">
            <button
              onClick={generate}
              disabled={!personImg || !clothImg || loading}
              className="h-14 w-full rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_oklch(0.52_0.16_152/0.5)] disabled:opacity-40 active:scale-[0.98] transition"
            >
              {loading ? <><Loader2 className="size-4 animate-spin" /> Generating…</> : <><Sparkles className="size-4" /> Generate Try-On</>}
            </button>
            {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}
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
                {result && !loading && <img src={result} alt="Try-on result" className="w-full h-full object-cover" />}
              </div>
              {result && !loading && (
                <a href={result} download="tryonix.jpg" className="mt-3 h-12 rounded-full border border-border bg-card font-semibold inline-flex items-center justify-center gap-2 w-full">
                  <Download className="size-4" /> Download
                </a>
              )}
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-card border-t border-border px-4 pt-2 pb-4 grid grid-cols-4 gap-2">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Wand2, label: "AI Edit" },
            { icon: Images, label: "My Images" },
            { icon: SettingsIcon, label: "Settings" },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className={`flex flex-col items-center gap-1 py-1 ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
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
