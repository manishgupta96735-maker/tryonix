import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Loader2, Share2, Shirt, Sparkles, UserRound, Zap } from "lucide-react";
import { PublicPage, useGuestCredits } from "@/components/SiteChrome";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { readTryOnRecord, saveTryOnDraft, type TryOnRecord } from "@/lib/tryon-storage";

export const Route = createFileRoute("/result")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your Try-On Result — TryOnix" },
      { name: "description", content: "Here's how you look in the outfit. Try another style or download your result." },
      { property: "og:title", content: "Your Try-On Result — TryOnix" },
      { property: "og:description", content: "Here's how you look in the outfit. Try another style or download your result." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate({ from: "/result" });
  const credits = useGuestCredits();
  const [record, setRecord] = useState<TryOnRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    readTryOnRecord()
      .then((r) => {
        if (cancelled) return;
        if (r?.result) {
          setRecord(r);
          setStatus("ready");
        } else {
          setStatus("empty");
        }
      })
      .catch(() => { if (!cancelled) setStatus("empty"); });
    return () => { cancelled = true; };
  }, []);

  const backToUpload = (clear: "outfit" | "person") => {
    if (record) {
      const draft = clear === "outfit"
        ? { person: record.person, outfit: "" }
        : { person: "", outfit: record.outfit };
      saveTryOnDraft(draft).catch(() => {});
    }
    navigate({ to: "/", hash: "upload" });
  };

  const share = async () => {
    if (!record) return;
    setNote(null);
    try {
      const res = await fetch(record.result);
      const blob = await res.blob();
      const file = new File([blob], "tryonix-result.png", { type: blob.type || "image/png" });
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "My TryOnix try-on" });
        return;
      }
    } catch {
      // Fall through to link sharing below; user-cancelled shares land here too.
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNote("Result link copied");
    } catch {
      setNote("Sharing isn't supported here");
    }
    setTimeout(() => setNote(null), 2500);
  };

  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Your Try-On <span className="text-gradient">Result</span>
            <Sparkles className="ml-2 inline size-7 text-brand-coral" aria-hidden />
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Here's how you look in the outfit. Try another style or download your result.
          </p>
        </div>

        {status === "loading" && (
          <div className="mt-14 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="size-7 animate-spin text-brand-pink" />
            <p className="text-sm">Loading your result…</p>
          </div>
        )}

        {status === "empty" && (
          <div className="mx-auto mt-12 max-w-md rounded-[26px] border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
            <img src={mascotAsset.url} alt="TryOnix" className="mx-auto size-16 rounded-2xl object-cover" />
            <h2 className="mt-4 text-lg font-extrabold text-brand-navy">No try-on yet</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your generated result will appear here. Create your first try-on from the home page.
            </p>
            <Link
              to="/"
              hash="upload"
              className="brand-gradient mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-pink/25"
            >
              Try It Now <span aria-hidden>→</span>
            </Link>
          </div>
        )}

        {status === "ready" && record && (
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[210px_minmax(0,1fr)_290px]">
            <div className="order-2 flex gap-4 lg:order-1 lg:flex-col">
              <Thumb src={record.person} alt="Your uploaded photo" caption="Your Photo" />
              <Thumb src={record.outfit} alt="Your uploaded outfit" caption="Your Outfit" />
            </div>

            <div className="order-1 rounded-[26px] border border-border bg-card p-3 shadow-[var(--shadow-soft)] lg:order-2">
              <div className="relative overflow-hidden rounded-[20px] bg-secondary/50">
                <img src={record.result} alt="AI try-on result" className="mx-auto max-h-[680px] w-full object-contain" />
                <span className="brand-gradient absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-md">
                  ✦ Try-On Result
                </span>
              </div>
            </div>

            <div className="order-3 space-y-3">
              <a
                href={record.result}
                download={`tryonix-${Date.now()}.png`}
                className="brand-gradient flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-pink/25 transition-transform hover:-translate-y-0.5"
              >
                <Download className="size-4" aria-hidden /> Download Image
              </a>
              <ActionButton icon={Shirt} label="Try Another Outfit" onClick={() => backToUpload("outfit")} />
              <ActionButton icon={UserRound} label="Use Different Photo" onClick={() => backToUpload("person")} />
              <ActionButton icon={Share2} label="Share Result" onClick={share} />
              {note && <p className="text-center text-xs font-semibold text-brand-green">{note}</p>}

              <div className="mt-5 rounded-[20px] border border-brand-pink/20 bg-brand-pink-soft p-4 text-center">
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-navy">
                  <Zap className="size-4 text-brand-pink" aria-hidden />
                  {credits} free {credits === 1 ? "try-on" : "try-ons"} left
                </p>
                <p className="mt-1 text-xs text-muted-foreground">No sign-up needed for your first 3.</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </PublicPage>
  );
}

function Thumb({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="flex-1 rounded-[20px] border border-border bg-card p-2.5 text-center shadow-[var(--shadow-soft)] lg:flex-none">
      <img src={src} alt={alt} className="aspect-[3/4] w-full rounded-2xl object-cover" />
      <figcaption className="pb-1 pt-2 text-xs font-bold text-brand-navy">{caption}</figcaption>
    </figure>
  );
}

function ActionButton({
  icon: Icon, label, onClick,
}: { icon: typeof Shirt; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 text-[15px] font-bold text-brand-navy transition-colors hover:bg-secondary"
    >
      <Icon className="size-4 text-brand-pink" aria-hidden /> {label}
    </button>
  );
}
