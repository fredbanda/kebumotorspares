import PolicyPage from "@/components/PolicyPage";

export const metadata = {
  title: "Return Policy | Kebu Motor Spares",
  description:
    "Return and exchange policy for Kebu Motor Spares — 30-day returns and 6-month defect returns.",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      title="Return Policy"
      intro="We want every part you buy from Kebu Motor Spares to fit, work and last. If something isn't right, here is how returns, exchanges and warranties work."
      sections={[
        {
          heading: "Time limits",
          paragraphs: [
            "If we deliver the wrong item to you, your item arrives damaged on delivery, your item is missing parts, or you changed your mind and you no longer want the item, you must return it to us within 30 days of delivery. You must return defective items within 6 months of delivery.",
          ],
        },
        {
          heading: "Prepare your return",
          paragraphs: [
            "Please package your return carefully to prevent damage during transit. You must return the item in its original product packaging with all the accessories and parts included, and all seals must be intact (if applicable). If you don't, we will not accept the return and will send the item back to you. However, you may log the return again if you can do so with all the missing packaging and parts, but we may charge you a fee for collecting the item from you and, where applicable, a fee for delivering the same or a replacement item back to you.",
          ],
        },
        {
          heading: "Wrong item, damaged on delivery, or missing parts",
          paragraphs: [
            "If we deliver the wrong item to you, your item arrives damaged on delivery, or your item is missing parts, you must return it to us within 30 days of delivery. We can replace the item, credit your Kebu Motor Spares account with the purchase price, or refund you — it's your choice. However, if we do not have replacement stock available, we'll rather credit your Kebu Motor Spares account.",
            "An item will not be considered as damaged on delivery if, for example, the item:",
          ],
          bullets: [
            "is damaged by you;",
            "is damaged due to electrical surges; or",
            "works as described on our website, but you're using it for an unintended purpose.",
          ],
        },
        {
          heading: "You changed your mind",
          paragraphs: [
            "If you simply changed your mind and you no longer want the item, you must return it to us within 30 days of delivery.",
          ],
        },
        {
          heading: "Defective items",
          paragraphs: [
            "You must return defective items within 6 months of delivery. When we receive the item, we'll inspect it. If we accept the return, you must choose whether we should repair or replace the item, credit your Kebu Motor Spares account with the purchase price, or refund you. Keep in mind that not all defects can be repaired, and we may not always have replacement stock available.",
            "A defective item will not be accepted if the item:",
          ],
          bullets: [
            "is faulty due to normal wear and tear (that means the normal damage that occurs over time);",
            "is damaged by you or you didn't take good care of it;",
            "is damaged by electrical surges or sea air corrosion (like rust);",
            "is damaged because you modified it; or",
            "works as described on our website, but you're using it for an unintended purpose.",
          ],
        },
        {
          heading: "Warranty items",
          paragraphs: [
            "Some items have extended warranties. So, while you have up to 6 months to return a defective item, certain items may have warranties that extend beyond 6 months. This information will be on the product description page. Please make sure you understand the terms and conditions of those extended warranties.",
            "Here's how we deal with extended warranty returns: you must log your return with us as soon as possible if an item becomes defective more than 6 months after delivery. We'll help you return the item to the supplier for free. The supplier will then inspect the item and decide whether to accept the return. They may charge you an evaluation fee. If the supplier accepts the return and offers to repair or replace the item and this takes longer than 21 days from when the item is received at the supplier's returns evaluation facility, we'll offer you credit or a refund directly from Kebu Motor Spares.",
          ],
        },
        {
          heading: "Direct warranties",
          paragraphs: [
            "Some items have manufacturer warranties. With a manufacturer warranty, the manufacturer handles the return of any defective items themselves. When you log the return of a defective item with a manufacturer warranty, you will receive the contact details of the relevant manufacturer. You must then contact that manufacturer directly.",
          ],
        },
      ]}
    />
  );
}
