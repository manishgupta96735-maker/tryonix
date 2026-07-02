import { createFileRoute } from "@tanstack/react-router";
import { LegalShell, Section } from "./privacy";

const UPDATED = "July 2, 2026";

export const Route = createFileRoute("/terms")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Terms of Service — TryOnix" },
      { name: "description", content: "The terms and conditions that govern your use of TryOnix's AI virtual try-on platform." },
      { property: "og:title", content: "Terms of Service — TryOnix" },
      { property: "og:description", content: "The terms that govern your use of TryOnix." },
      { property: "og:type", content: "article" },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated={UPDATED}>
      <Section title="1. Agreement">
        <p>
          These Terms of Service ("Terms") form a binding agreement between you and TryOnix
          ("TryOnix", "we", "our", or "us") governing your access to and use of our website,
          applications, and services (collectively, the "Service"). By using the Service you
          agree to these Terms. If you do not agree, do not use the Service.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>
          You must be at least 13 years old (or 16 in some jurisdictions) to use TryOnix. If
          you use the Service on behalf of an organization, you represent that you have
          authority to bind that organization to these Terms.
        </p>
      </Section>

      <Section title="3. Accounts">
        <ul>
          <li>You must provide accurate information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your credentials.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>Notify us immediately of any unauthorized access.</li>
        </ul>
      </Section>

      <Section title="4. Google Sign-In">
        <p>
          You may sign in using Google. By doing so, you authorize us to access your basic
          Google profile information (name, email, profile picture) for authentication only.
          Your use of Google services remains subject to Google's terms and policies.
        </p>
      </Section>

      <Section title="5. AI-Generated Content">
        <p>
          TryOnix uses AI models to generate virtual try-on imagery based on the photos and
          garments you provide. You understand that:
        </p>
        <ul>
          <li>AI outputs may contain inaccuracies, distortions, or artifacts.</li>
          <li>Results are illustrative and not a guarantee of real-world fit or appearance.</li>
          <li>You are responsible for the content you upload and how you use generated results.</li>
          <li>You must have the rights to any photos or garment images you upload.</li>
        </ul>
      </Section>

      <Section title="6. Acceptable Use">
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Upload images of other people without their explicit consent.</li>
          <li>Generate sexual, obscene, hateful, harassing, defamatory, or illegal content.</li>
          <li>Impersonate any person or misrepresent your identity.</li>
          <li>Infringe intellectual property, privacy, or publicity rights.</li>
          <li>Attempt to reverse engineer, disrupt, or exploit the Service or its models.</li>
          <li>Use the Service to build a competing product or scrape data at scale.</li>
        </ul>
        <p>We may suspend or terminate accounts that violate these rules.</p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          TryOnix, its logo, mascot, brand assets, software, and underlying technology are the
          exclusive property of TryOnix and its licensors and are protected by intellectual
          property laws. You may not copy, modify, distribute, or create derivative works
          without our prior written permission.
        </p>
        <p>
          You retain ownership of content you upload. By using the Service, you grant TryOnix
          a limited, worldwide, non-exclusive license to store, process, and display your
          content solely to provide the Service to you. You own the AI-generated images
          produced for you, subject to these Terms and applicable law.
        </p>
      </Section>

      <Section title="8. Plans, Credits & Payments">
        <p>
          Certain features require paid plans or credits. Fees are charged in advance and are
          non-refundable except where required by law. We may change pricing with reasonable
          notice. Unused credits may expire per your plan's terms.
        </p>
      </Section>

      <Section title="9. Third-Party Services">
        <p>
          The Service may integrate with third-party providers (such as authentication,
          payments, storage, or AI model providers). We are not responsible for third-party
          services, and your use of them is governed by their own terms.
        </p>
      </Section>

      <Section title="10. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
          WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, NON-INFRINGEMENT, ACCURACY OF AI OUTPUTS, OR UNINTERRUPTED OPERATION.
        </p>
      </Section>

      <Section title="11. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRYONIX AND ITS AFFILIATES SHALL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
          ANY LOSS OF PROFITS, REVENUES, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE
          SERVICE. OUR TOTAL AGGREGATE LIABILITY WILL NOT EXCEED THE GREATER OF (A) THE
          AMOUNTS YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM OR (B) USD $100.
        </p>
      </Section>

      <Section title="12. Indemnification">
        <p>
          You agree to defend and indemnify TryOnix from any claims, losses, or expenses
          arising out of your content, your use of the Service, or your violation of these
          Terms or applicable law.
        </p>
      </Section>

      <Section title="13. Termination">
        <p>
          You may stop using the Service at any time and request account deletion. We may
          suspend or terminate your account if you violate these Terms, misuse the Service, or
          create risk or legal exposure for TryOnix. Upon termination, your right to use the
          Service ends immediately; sections that by nature should survive will continue to
          apply.
        </p>
      </Section>

      <Section title="14. Changes to the Service or Terms">
        <p>
          We may update the Service and these Terms from time to time. Material changes will
          be posted on this page with a new effective date. Your continued use after changes
          take effect constitutes acceptance.
        </p>
      </Section>

      <Section title="15. Governing Law">
        <p>
          These Terms are governed by applicable law in the jurisdiction where TryOnix
          operates, without regard to conflict-of-law rules. Disputes will be resolved in the
          competent courts of that jurisdiction, unless mandatory local law provides otherwise.
        </p>
      </Section>

      <Section title="16. Contact">
        <p>
          Questions about these Terms? Email us at{" "}
          <a href="mailto:legal@tryonix.app" className="text-primary hover:underline">
            legal@tryonix.app
          </a>.
        </p>
      </Section>
    </LegalShell>
  );
}
