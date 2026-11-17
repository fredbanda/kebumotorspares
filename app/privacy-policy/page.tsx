import PolicyPage from "@/components/PolicyPage";

export const metadata = {
  title: "Privacy Policy | Kebu Motor Spares",
  description:
    "How Kebu Motor Spares collects, uses and protects your personal information under POPIA.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="Kebu Motor Spares respects your privacy and is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA) of South Africa."
      sections={[
        {
          heading: "Information we collect",
          bullets: [
            "Identity and contact details (name, email, phone number, delivery address) when you place an order or create an account;",
            "Order and return history;",
            "Payment information — processed securely by our payment provider (PayFast); we do not store your full card details;",
            "Communications with us, including WhatsApp messages and emails.",
          ],
        },
        {
          heading: "How we use your information",
          bullets: [
            "To process and deliver your orders and handle returns, refunds and warranties;",
            "To communicate with you about your orders;",
            "To send you newsletters and offers, only if you have opted in — you can unsubscribe at any time;",
            "To improve our website, products and services;",
            "To comply with legal and regulatory obligations.",
          ],
        },
        {
          heading: "Sharing your information",
          paragraphs: [
            "We do not sell your personal information. We only share it with service providers who help us operate our business, such as couriers and delivery companies, our payment processor, and IT and hosting providers. These parties are only given the information they need to perform their services for us.",
            "We may also disclose information where required by law or to protect our rights.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "Our website uses cookies and similar technologies to keep your cart working, remember your preferences and understand how the site is used. You can set your browser to refuse cookies, but some parts of the site may then not function correctly.",
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "We take reasonable technical and organisational measures to protect your personal information against loss, unauthorised access, disclosure or destruction. Payments on our site are processed over encrypted connections.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "Under POPIA you have the right to access the personal information we hold about you, to request the correction or deletion of that information, and to object to the processing of your information. To exercise any of these rights, contact us at support@kebumotorspares.co.za.",
          ],
        },
        {
          heading: "Retention",
          paragraphs: [
            "We keep your personal information only as long as necessary for the purposes set out in this policy, including to meet legal, accounting and warranty obligations.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "We may update this Privacy Policy from time to time. The latest version will always be available on this page.",
          ],
        },
      ]}
    />
  );
}

