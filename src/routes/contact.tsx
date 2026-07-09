import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { Mail, MessageSquare, Send, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Contact — TryOnix" },
      { name: "description", content: "Contact the TryOnix team for support, partnerships, or press inquiries." },
      { property: "og:title", content: "Contact TryOnix" },
      { property: "og:description", content: "Get in touch with the TryOnix team." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    // Open user's email client with prefilled message (no backend endpoint required)
    const subject = encodeURIComponent(`TryOnix contact from ${parsed.data.name}`);
    const body = encodeURIComponent(`${parsed.data.message}\n\n— ${parsed.data.name} <${parsed.data.email}>`);
    window.location.href = `mailto:hello@tryonix.app?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-5 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary">
            <img src={mascotAsset.url} alt="TryOnix" className="size-8 rounded-full" />
            <span>TryOnix</span>
          </Link>
          <Link to="/app" className="text-sm rounded-full bg-primary text-primary-foreground px-4 py-2 font-semibold">Try free</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We reply to most messages within one business day.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <a href="mailto:hello@tryonix.app" className="rounded-2xl border border-border bg-card p-5 hover:border-primary transition">
            <Mail className="size-6 text-primary" />
            <h3 className="mt-3 font-semibold">Email</h3>
            <p className="text-sm text-muted-foreground">hello@tryonix.app</p>
          </a>
          <div className="rounded-2xl border border-border bg-card p-5">
            <MessageSquare className="size-6 text-primary" />
            <h3 className="mt-3 font-semibold">Support</h3>
            <p className="text-sm text-muted-foreground">Sign in and use the in-app help menu for account-specific support.</p>
          </div>
        </div>

        {sent ? (
          <div className="mt-10 rounded-2xl border border-primary/40 bg-primary/5 p-6 text-center">
            <CheckCircle2 className="size-10 text-primary mx-auto" />
            <h2 className="mt-3 text-xl font-semibold">Your email client is open</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Finish sending the message from your email app. We'll respond as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-12 rounded-2xl border border-border bg-card px-4 outline-none focus:border-primary"
              maxLength={100}
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-12 rounded-2xl border border-border bg-card px-4 outline-none focus:border-primary"
              maxLength={255}
            />
            <textarea
              placeholder="How can we help?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="w-full rounded-2xl border border-border bg-card p-4 outline-none focus:border-primary resize-none"
              maxLength={2000}
            />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 h-12 font-semibold disabled:opacity-50"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send message
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
