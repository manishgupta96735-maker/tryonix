import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Upload, Sparkles, Download, ArrowLeft, Loader2, ImageIcon, Shirt } from "lucide-react";

export const Route = createFileRoute("/try-on")({
  head: () => ({
    meta: [
      { title: "Try On Demo — FitMirror" },
      { name: "description", content: "Upload your photo and a clothing item to see AI virtual try-on in action." },
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

  const reset = () => { setPersonImg(null); setClothImg(null); setResult(null); setError(null); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back
          </Link>
          <div className="font-display text-lg">FitMirror Demo</div>
          <div className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="text-center mb-10 fade-up">
          <h1 className="font-display text-4xl md:text-5xl">Virtual Try-On</h1>
          <p className="mt-3 text-muted-foreground text-sm">Upload your photo + a clothing item. AI does the rest.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <UploadCard label="Your photo" hint="Front-facing, full body works best" icon={ImageIcon} value={personImg} onChange={setPersonImg} />
          <UploadCard label="Clothing item" hint="Product photo on plain background" icon={Shirt} value={clothImg} onChange={setClothImg} />
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={generate}
            disabled={!personImg || !clothImg || loading}
            className="h-12 px-6 rounded-full bg-foreground text-background font-medium inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="size-4 animate-spin" /> Generating…</> : <><Sparkles className="size-4" /> Generate try-on</>}
          </button>
          {(personImg || clothImg) && (
            <button onClick={reset} className="h-12 px-5 rounded-full border border-border font-medium">Reset</button>
          )}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-destructive">{error}</p>
        )}



        {(loading || result) && (
          <div className="mt-12 max-w-2xl mx-auto fade-up">
            <h2 className="font-display text-2xl mb-4 text-center">Result</h2>
            <div className="rounded-3xl border border-border overflow-hidden aspect-[3/4] bg-muted relative">
              {loading && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <Loader2 className="size-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">AI is fitting the garment…</p>
                  </div>
                </div>
              )}
              {result && !loading && (
                <img src={result} alt="Try-on result" className="w-full h-full object-cover" />
              )}
            </div>
            {result && !loading && (
              <div className="mt-4 flex justify-center">
                <a href={result} download="fitmirror-tryon.jpg" className="h-11 px-5 rounded-full border border-border font-medium inline-flex items-center gap-2">
                  <Download className="size-4" /> Download
                </a>
              </div>
            )}
          </div>
        )}

        <p className="mt-16 text-center text-xs text-muted-foreground max-w-md mx-auto">
          This is a demo preview. Connect AI provider (Replicate / HuggingFace) and enable Lovable Cloud to ship to production.
        </p>
      </main>
    </div>
  );
}

function UploadCard({
  label, hint, icon: Icon, value, onChange,
}: { label: string; hint: string; icon: any; value: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const pick = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
      className="aspect-[3/4] rounded-3xl border-2 border-dashed border-border hover:border-foreground/50 transition cursor-pointer overflow-hidden relative group bg-muted/30"
    >
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => pick(e.target.files?.[0] ?? undefined)} />
      {value ? (
        <>
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-xs font-medium">
            {label} — click to replace
          </div>
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-center p-6">
          <div>
            <div className="size-12 mx-auto rounded-full bg-foreground/5 grid place-items-center mb-3">
              <Icon className="size-5 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium">
              <Upload className="size-3.5" /> Upload
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
