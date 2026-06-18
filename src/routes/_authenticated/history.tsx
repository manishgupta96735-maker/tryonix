import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2, Images, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "My History — TryOnix" }] }),
  component: HistoryPage,
});

type Item = { id: string; result_url: string; created_at: string; hd: boolean };

function HistoryPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [preview, setPreview] = useState<Item | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("tryon_history")
      .select("id,result_url,created_at,hd")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { void load(); }, []);

  const remove = async (id: string) => {
    await supabase.from("tryon_history").delete().eq("id", id);
    setItems(items => items?.filter(i => i.id !== id) ?? null);
    setPreview(null);
  };

  return (
    <MobileShell>
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="font-bold text-lg">My Images</div>
        <div className="font-bold text-lg text-primary">TryOnix</div>
        <div className="w-10" />
      </header>

      <main className="px-5 flex-1">
        {items === null && (
          <div className="grid place-items-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>
        )}
        {items?.length === 0 && (
          <div className="text-center py-20">
            <div className="size-16 mx-auto rounded-full bg-primary-soft grid place-items-center mb-3">
              <Images className="size-7 text-primary" />
            </div>
            <p className="font-semibold">No try-ons yet</p>
            <p className="text-sm text-muted-foreground mt-1">Your saved try-ons will appear here.</p>
          </div>
        )}
        {items && items.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {items.map(it => (
              <button key={it.id} onClick={() => setPreview(it)} className="aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted relative">
                <img src={it.result_url} alt="" className="w-full h-full object-cover" />
                {it.hd && <span className="absolute top-2 left-2 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">HD</span>}
              </button>
            ))}
          </div>
        )}
      </main>

      {preview && (
        <div onClick={() => setPreview(null)} className="fixed inset-0 bg-black/70 z-30 grid place-items-center p-6">
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[380px] bg-card rounded-3xl overflow-hidden">
            <img src={preview.result_url} alt="" className="w-full aspect-[3/4] object-cover" />
            <div className="p-4 flex gap-2">
              <a href={preview.result_url} download={`tryonix-${preview.id}.jpg`} className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2">
                <Download className="size-4" /> Download
              </a>
              <button onClick={() => remove(preview.id)} className="size-12 rounded-full border border-border grid place-items-center text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
