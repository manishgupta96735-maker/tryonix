import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tryon")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { personImage, clothImage } = (await request.json()) as {
            personImage?: string;
            clothImage?: string;
          };
          if (!personImage || !clothImage) {
            return Response.json({ error: "Both images required" }, { status: 400 });
          }
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return Response.json({ error: "AI not configured" }, { status: 500 });

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3.1-flash-image-preview",
              modalities: ["image", "text"],
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text:
                        "Virtual try-on. Image 1 is a person. Image 2 is a clothing garment. " +
                        "Generate a single photorealistic image of the SAME person from Image 1 wearing the garment from Image 2. " +
                        "Preserve the person's face, hair, skin tone, body shape, and pose exactly. " +
                        "Match realistic fabric drape, lighting, and shadows. Keep a clean studio background. " +
                        "Do NOT include text or watermarks. Output only the final image.",
                    },
                    { type: "image_url", image_url: { url: personImage } },
                    { type: "image_url", image_url: { url: clothImage } },
                  ],
                },
              ],
            }),
          });

          if (upstream.status === 429) {
            return Response.json({ error: "Rate limit hit. Please try again in a moment." }, { status: 429 });
          }
          if (upstream.status === 402) {
            return Response.json({ error: "AI credits exhausted. Please add credits to continue." }, { status: 402 });
          }
          if (!upstream.ok) {
            const txt = await upstream.text();
            console.error("Gateway error", upstream.status, txt);
            return Response.json({ error: "AI generation failed" }, { status: 500 });
          }

          const data = (await upstream.json()) as {
            choices?: Array<{
              message?: {
                images?: Array<{ image_url?: { url?: string } }>;
                content?: string;
              };
            }>;
          };

          const url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (!url) {
            console.error("No image in response", JSON.stringify(data).slice(0, 500));
            return Response.json({ error: "AI returned no image" }, { status: 500 });
          }
          return Response.json({ image: url });
        } catch (err) {
          console.error("Try-on error", err);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
      },
    },
  },
});
