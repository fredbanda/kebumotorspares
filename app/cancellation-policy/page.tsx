import PolicyPage from "@/components/PolicyPage";

export const metadata = {
  title: "Cancellation Policy | Kebu Motor Spares",
  description:
    "How to cancel an order with Kebu Motor Spares, and what happens when we cancel an order.",
};

export default function CancellationPolicyPage() {
  return (
    <PolicyPage
      title="Cancellation Policy"
      intro="You can cancel an order, and in some cases we may need to cancel one too. Here's how it works."
      sections={[
        {
          heading: "Cancelling before dispatch",
          paragraphs: [
            "You may cancel your order for a full refund (including any delivery fee paid) at any time before it is dispatched. The quickest way to do this is to contact us on WhatsApp at 073 374 7856 or email support@kebumotorspares.co.za with your order number.",
          ],
        },
        {
          heading: "Cancelling after dispatch",
          paragraphs: [
            "Once your order has been dispatched, we are unable to stop the delivery. You are welcome to refuse delivery of the parcel or return the item to us in line with our Return Policy. Original delivery fees are non-refundable in this case, and you may be responsible for the courier's return costs.",
          ],
        },
        {
          heading: "Made-to-order and special-order items",
          paragraphs: [
            "Certain items — such as special-order parts, made-to-order components and items clearly marked as non-refundable or non-cancellable on the product page — cannot be cancelled once confirmed. We'll always flag this clearly before you order.",
          ],
        },
        {
          heading: "When we cancel an order",
          paragraphs: ["We may cancel an order (in whole or in part) if:"],
          bullets: [
            "the item is out of stock or discontinued;",
            "there was an error in the price or product description;",
            "we suspect the order is fraudulent; or",
            "we cannot verify your payment or delivery details.",
          ],
        },
        {
          heading: "Refunds on cancellations",
          paragraphs: [
            "Approved cancellations are refunded in line with our Refund Policy, generally within 7 to 10 business days to your original payment method.",
          ],
        },
      ]}
    />
  );
}

