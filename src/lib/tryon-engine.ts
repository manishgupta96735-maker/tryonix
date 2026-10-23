// Client-side multi-space try-on engine. Runs in the browser only (dynamic import of @gradio/client).
export type TryOnStep =
  | "idle"
  | "preparing_images"
  | "connecting"
  | "in_queue"
  | "processing"
  | "switching_server"
  | "success"
  | "server_busy";

export interface EngineUpdate {
  step: TryOnStep;
  server?: string;
  queuePosition?: number | null;
}

const SPACE_TIMEOUT_MS = 45_000;

type SpaceAdapter = {
  id: string;
  label: string;
  run: (client: any, person: Blob, outfit: Blob) => Promise<unknown>;
};

const SPACES: SpaceAdapter[] = [
  {
    id: "yisol/IDM-VTON",
    label: "Primary AI server",
    run: (c, person, outfit) =>
      c.predict("/tryon", {
        dict: { background: person, layers: [], composite: null },
        garm_img: outfit,
        garment_des: "clothing item",
        is_checked: true,
        is_checked_crop: false,
        denoise_steps: 20,
        seed: 42,
      }),
  },
  {
    id: "Kwai-Kolors/Kolors-Virtual-Try-On",
    label: "Backup AI server",
    run: (c, person, outfit) =>
      c.predict("/tryon", { person_img: person, garment_img: outfit, seed: 0, randomize_seed: true }),
  },
  {
    id: "zhengchong/CatVTON",
    label: "Backup AI server 2",
    run: (c, person, outfit) =>
      c.predict("/submit_function", {
        person_image: { background: person, layers: [], composite: null },
        cloth_image: outfit,
        cloth_type: "upper",
        num_inference_steps: 20,
        guidance_scale: 2.5,
        seed: 42,
        show_type: "result only",
      }),
  },
];

/** Shrink large images so uploads to free servers are fast. Returns a JPEG Blob. */
export async function prepareImage(dataUrl: string, maxSide = 1024): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode"))), "image/jpeg", 0.8));
}

function extractUrl(data: unknown): string | null {
  const walk = (v: any): string | null => {
    if (!v) return null;
    if (typeof v === "string") return /^(https?:|data:image)/.test(v) ? v : null;
    if (Array.isArray(v)) {
      for (const x of v) { const r = walk(x); if (r) return r; }
      return null;
    }
    if (typeof v === "object") return walk(v.url) ?? walk(v.path && v.url) ?? walk(v.image) ?? walk(v.value);
    return null;
  };
  return walk((data as any)?.data ?? data);
}

async function urlToDataUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) return url;
  const blob = await (await fetch(url)).blob();
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error("timeout")), ms);
    p.then((v) => { clearTimeout(t); res(v); }, (e) => { clearTimeout(t); rej(e); });
  });
}

async function runSpace(space: SpaceAdapter, person: Blob, outfit: Blob, onUpdate: (u: EngineUpdate) => void) {
  const { Client } = await import("@gradio/client");
  onUpdate({ step: "connecting", server: space.label });
  const client: any = await withTimeout(
    Client.connect(space.id, {
      events: ["data", "status"],
      status_callback: () => {},
    } as any),
    15_000,
  );
  onUpdate({ step: "in_queue", server: space.label, queuePosition: null });
  const job = space.run(client, person, outfit);
  const result = await withTimeout(job as Promise<unknown>, SPACE_TIMEOUT_MS);
  const url = extractUrl(result);
  if (!url) throw new Error("no image");
  onUpdate({ step: "processing", server: space.label });
  return urlToDataUrl(url);
}

/** Final fallback: the app's own AI service. */
async function runHostedFallback(personUrl: string, outfitUrl: string, onUpdate: (u: EngineUpdate) => void) {
  onUpdate({ step: "processing", server: "TryOnix AI server" });
  const res = await withTimeout(
    fetch("/api/tryon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personImage: personUrl, clothImage: outfitUrl }),
    }),
    90_000,
  );
  const data = await res.json();
  if (!res.ok || !data.image) throw new Error(data.error || "failed");
  return data.image as string;
}

export class AllServersBusyError extends Error {
  constructor() { super("All free AI servers are currently full."); }
}

/** Runs pool in order; throws AllServersBusyError when every server fails. */
export async function runTryOn(personUrl: string, outfitUrl: string, onUpdate: (u: EngineUpdate) => void): Promise<string> {
  onUpdate({ step: "preparing_images" });
  const [person, outfit] = await Promise.all([prepareImage(personUrl), prepareImage(outfitUrl)]);

  for (let i = 0; i < SPACES.length; i++) {
    if (i > 0) onUpdate({ step: "switching_server", server: SPACES[i].label });
    try {
      return await runSpace(SPACES[i], person, outfit, onUpdate);
    } catch (e) {
      console.warn(`[tryon] ${SPACES[i].id} failed:`, e);
    }
  }
  onUpdate({ step: "switching_server", server: "TryOnix AI server" });
  try {
    return await runHostedFallback(personUrl, outfitUrl, onUpdate);
  } catch (e) {
    console.warn("[tryon] hosted fallback failed:", e);
    throw new AllServersBusyError();
  }
}

export const STEP_MESSAGES: Record<TryOnStep, string> = {
  idle: "",
  preparing_images: "Preparing your photos...",
  connecting: "Connecting to server...",
  in_queue: "In queue...",
  processing: "Generating your virtual outfit...",
  switching_server: "Switching to backup AI server...",
  success: "Done!",
  server_busy: "All free AI servers are currently full.",
};
