import { createFileRoute, Link } from "@tanstack/react-router";
import mascotAsset from "@/assets/mascot.png.asset.json";

const mascot = mascotAsset.url;
const UPDATED = "July 2, 2026";

export const Route = createFileRoute("/privacy")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Privacy Policy — TryOnix" },
      { name: "description", content: "How TryOnix collects, uses, and protects your data across our AI virtual try-on platform." },
      { property: "og:title", content: "Privacy Policy — TryOnix" },
      { property: "og:description", content: "How TryOnix collects, uses, and protects your data." },
      { property: "og:type", content: "article" },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated={UPDATED}>
      <Section title="1. Introduction">
        <p>
          Welcome to TryOnix ("TryOnix", "we", "our", or "us"). We build an AI-powered virtual
          try-on platform that lets users visualize outfits on themselves. This Privacy Policy
          explains what information we collect, how we use it, and the rights you have over it
          when you use our website, apps, and services (collectively, the "Service").
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul>
          <li><b>Account data:</b> name, email address, profile image, and authentication identifiers.</li>
          <li><b>Uploaded content:</b> photos of yourself, garment images, and any prompts or metadata you submit for try-on generation.</li>
          <li><b>Generated content:</b> AI-generated try-on images and associated processing metadata.</li>
          <li><b>Usage data:</b> device type, browser, IP address, pages viewed, and interaction events.</li>
          <li><b>Payment data:</b> processed by third-party payment providers; we store only limited billing metadata (plan, status, invoice IDs).</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul>
          <li>Provide, operate, and improve the Service, including AI try-on generation.</li>
          <li>Authenticate users and secure accounts.</li>
          <li>Communicate about updates, billing, and support.</li>
          <li>Analyze usage to improve model quality, reliability, and user experience.</li>
          <li>Comply with legal obligations and enforce our Terms.</li>
        </ul>
      </Section>

      <Section title="4. Google Sign-In">
        <p>
          When you sign in with Google, we receive your basic profile information (name, email,
          profile picture, and a unique Google account identifier) as authorized by you. We do
          not access your Gmail, Drive, contacts, or any other Google service data. You can
          revoke access at any time from your Google account security settings.
        </p>
      </Section>

      <Section title="5. Cookies & Tracking">
        <p>
          TryOnix uses cookies and similar technologies to keep you signed in, remember
          preferences, secure sessions, and measure product performance. You can control
          cookies through your browser settings. Disabling essential cookies may prevent parts
          of the Service from working properly.
        </p>
      </Section>

      <Section title="6. AI-Generated Content">
        <p>
          Photos and garment images you upload are processed by our AI models (and trusted
          third-party model providers) solely to generate your try-on outputs. We do not use
          your personal photos to train foundation models without your explicit consent.
          Generated images are stored in your account history so you can revisit or download
          them, and you may delete them at any time.
        </p>
      </Section>

      <Section title="7. Data Sharing">
        <p>We share information only with:</p>
        <ul>
          <li><b>Service providers</b> who host infrastructure, process payments, deliver email, or provide AI model inference under strict confidentiality.</li>
          <li><b>Legal authorities</b> when required by law, subpoena, or to protect the rights, safety, and property of TryOnix or others.</li>
          <li><b>Business transfers</b> in the event of a merger, acquisition, or asset sale, with notice to affected users.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </Section>

      <Section title="8. Data Retention">
        <p>
          We retain account and content data for as long as your account is active. You can
          delete individual try-on results at any time, or request full account deletion via
          our contact channels. Backups and legal-hold copies may persist for a limited period
          after deletion.
        </p>
      </Section>

      <Section title="9. Security">
        <p>
          We use industry-standard safeguards including encryption in transit, access controls,
          and monitoring. No system is 100% secure, so we cannot guarantee absolute security,
          but we work continuously to protect your data.
        </p>
      </Section>

      <Section title="10. Your Rights">
        <p>
          Depending on your jurisdiction (including under GDPR and CCPA), you may have the right
          to access, correct, export, restrict, or delete your personal data, and to object to
          certain processing. Contact us to exercise these rights.
        </p>
      </Section>

      <Section title="11. Children's Privacy">
        <p>
          TryOnix is not directed to children under 13 (or under 16 in some jurisdictions). We
          do not knowingly collect personal information from children. If you believe a child
          has provided us data, please contact us and we will delete it.
        </p>
      </Section>

      <Section title="12. International Users">
        <p>
          TryOnix operates globally. By using the Service, you consent to the transfer of your
          information to countries that may have different data-protection laws than your own.
        </p>
      </Section>

      <Section title="13. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be posted
          on this page with an updated effective date. Continued use of the Service after
          changes take effect constitutes acceptance.
        </p>
      </Section>

      <Section title="14. Contact Us">
        <p>
          Questions or requests? Email us at{" "}
          <a href="mailto:privacy@tryonix.app" className="text-primary hover:underline">
            privacy@tryonix.app
          </a>.
        </p>
      </Section>
    </LegalShell>
  );
}

export function LegalShell({
  title, updated, children,
}: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-primary-soft overflow-hidden">
              <img src={mascot} alt="TryOnix" className="size-9 object-cover" />
            </div>
            <span className="font-bold text-lg text-primary">TryOnix</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition">Terms</Link>
            <Link to="/" className="hover:text-foreground transition">Home</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

        <article className="prose-legal mt-10">{children}</article>

        <div className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground flex flex-wrap gap-4 justify-between">
          <div>© {new Date().getFullYear()} TryOnix. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </main>

      <style>{`
        .prose-legal { font-size: 15px; line-height: 1.75; color: var(--color-foreground); }
        .prose-legal h2 { font-size: 20px; font-weight: 700; margin-top: 2.25rem; margin-bottom: 0.75rem; letter-spacing: -0.01em; }
        .prose-legal p { margin: 0.75rem 0; color: color-mix(in oklch, var(--color-foreground) 85%, transparent); }
        .prose-legal ul { list-style: disc; padding-left: 1.35rem; margin: 0.75rem 0; }
        .prose-legal li { margin: 0.35rem 0; color: color-mix(in oklch, var(--color-foreground) 85%, transparent); }
        .prose-legal b { color: var(--color-foreground); font-weight: 600; }
        .prose-legal a { color: var(--color-primary); }
      `}</style>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
