import PolicyPage from "@/components/PolicyPage";

export const metadata = {
  title: "Refund Policy | Kebu Motor Spares",
  description:
    "How and when Kebu Motor Spares issues refunds, credits and replacements.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      intro="Once we've accepted your return, here's how your refund, credit or replacement is processed."
      sections={[
        {
          heading: "Refund options",
          paragraphs: [
            "Where our Return Policy allows it, you may choose one of the following once we've inspected and accepted your return:",
          ],
          bullets: [
            "A refund to your original payment method;",
            "A credit to your Kebu Motor Spares account; or",
            "A replacement item (subject to stock availability).",
          ],
        },
        {
          heading: "Processing times",
          paragraphs: [
            "Refunds are processed within 7 to 10 business days after we've received and inspected your returned item. The time it takes for the money to reflect in your account depends on your bank or payment provider, and may take an additional 2 to 5 business days.",
            "Account credits are usually available on your Kebu Motor Spares profile within 24 hours of the refund being approved.",
          ],
        },
        {
          heading: "Delivery fees",
          paragraphs: [
            "If you are returning an item because we delivered the wrong item, the item arrived damaged, or parts were missing, we will also refund any delivery fee you paid for that order.",
            "If you are returning an item because you changed your mind, any original delivery fee is non-refundable, and you are responsible for the cost of returning the item to us.",
          ],
        },
        {
          heading: "Partial refunds",
          paragraphs: [
            "Where an item is returned incomplete, damaged after delivery, or missing its original packaging, we may offer a partial refund instead of a full refund, depending on the condition of the item. We'll always confirm this with you before processing a partial refund.",
          ],
        },
        {
          heading: "Cancellations and order refunds",
          paragraphs: [
            "If you cancel an order before it is dispatched, you will receive a full refund, including any delivery fee paid. Please see our Cancellation Policy for more details.",
          ],
        },
        {
          heading: "Payment method refunds",
          bullets: [
            "Card payments (Visa, Mastercard via PayFast) are refunded to the same card used for the purchase.",
            "Instant EFT payments are refunded to the bank account from which the payment was made.",
          ],
        },
      ]}
    />
  );
}

