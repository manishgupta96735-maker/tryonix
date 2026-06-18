import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/tryon")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization") || "";
          const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
          if (!token) return Response.json({ error: "Sign in required" }, { status: 401 });

          const SUPABASE_URL = process.env.SUPABASE_URL!;
          const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const userClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
          });

          const { data: userRes, error: userErr } = await userClient.auth.getUser(token);
          if (userErr || !userRes.user) return Response.json({ error: "Invalid session" }, { status: 401 });
          const userId = userRes.user.id;

          const { personImage, clothImage, hd } = (await request.json()) as {
            personImage?: string; clothImage?: string; hd?: boolean;
          };
          if (!personImage || !clothImage) {
            return Response.json({ error: "Both images required" }, { status: 400 });
          }

          // Check credits via admin client (RLS bypass for atomic deduct)
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: creditRow } = await supabaseAdmin
            .from("user_credits").select("balance,is_pro").eq("user_id", userId).maybeSingle();
          if (!creditRow || creditRow.balance <= 0) {
            return Response.json({ error: "You're out of credits. Upgrade to Pro for more." }, { status: 402 });
          }
          const useHd = !!hd && creditRow.is_pro;

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return Response.json({ error: "AI not configured" }, { status: 500 });

          const promptText =
            "Virtual try-on. Image 1 is a person. Image 2 is a clothing garment. " +
            "Generate a single photorealistic image of the SAME person from Image 1 wearing the garment from Image 2. " +
            "Preserve the person's face, hair, skin tone, body shape, and pose exactly. " +
            "Match realistic fabric drape, lighting, and shadows. Keep a clean studio background. " +
            (useHd ? "Render at maximum resolution and professional studio fidelity. " : "") +
            "Do NOT include text or watermarks. Output only the final image.";

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3.1-flash-image-preview",
              modalities: ["image", "text"],
              messages: [{
                role: "user",
                content: [
                  { type: "text", text: promptText },
                  { type: "image_url", image_url: { url: personImage } },
                  { type: "image_url", image_url: { url: clothImage } },
                ],
              }],
            }),
          });

          if (upstream.status === 429) {
            return Response.json({ error: "AI is busy right now. Please retry in a moment." }, { status: 429 });
          }
          if (upstream.status === 402) {
            return Response.json({ error: "Service credits exhausted. Try again later." }, { status: 402 });
          }
          if (!upstream.ok) {
            const txt = await upstream.text();
            console.error("Gateway error", upstream.status, txt);
            return Response.json({ error: "AI generation failed. Please retry." }, { status: 500 });
          }

          const data = (await upstream.json()) as {
            choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }>; content?: string } }>;
          };
          const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (!imageUrl) {
            console.error("No image in response", JSON.stringify(data).slice(0, 500));
            return Response.json({ error: "AI returned no image. Please retry." }, { status: 500 });
          }

          // Deduct credit + save history
          const newBalance = creditRow.balance - 1;
          await supabaseAdmin.from("user_credits").update({ balance: newBalance, updated_at: new Date().toISOString() }).eq("user_id", userId);
          await supabaseAdmin.from("tryon_history").insert({
            user_id: userId,
            result_url: imageUrl,
            hd: useHd,
          });

          return Response.json({ image: imageUrl, creditsRemaining: newBalance, hd: useHd });
        } catch (err) {
          console.error("Try-on error", err);
          return Response.json({ error: "Server error. Please retry." }, { status: 500 });
        }
      },
    },
  },
});
