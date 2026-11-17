import PolicyPage from "@/components/PolicyPage";

export const metadata = {
  title: "Shipping Policy | Kebu Motor Spares",
  description:
    "Delivery options, times and the R2000 free delivery threshold for Kebu Motor Spares.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="We deliver motor spares across South Africa. Here's what you can expect when you order from us."
      sections={[
        {
          heading: "Free delivery over R2,000",
          paragraphs: [
            "Orders with a subtotal of R2,000 or more qualify for FREE delivery anywhere in South Africa. If your order subtotal is below R2,000, a standard delivery fee will be calculated and shown at checkout before you confirm your order.",
          ],
        },
        {
          heading: "Delivery options & times",
          bullets: [
            "Standard delivery (main centres): 2 – 4 business days;",
            "Standard delivery (outlying areas): 3 – 7 business days;",
            "Order cut-off: orders placed after 14:00 on a business day are processed the following business day.",
          ],
          paragraphs: [
            "Business days exclude weekends and public holidays. Large or heavy items (engines, gearboxes, body panels) may take slightly longer and will be shipped via courier.",
          ],
        },
        {
          heading: "Dispatch & tracking",
          paragraphs: [
            "You'll receive an email once your order has been dispatched, including your waybill or tracking number where available. You can also track your order by contacting us with your order number.",
          ],
        },
        {
          heading: "Delivery address",
          paragraphs: [
            "Please make sure your delivery address and contact number are correct at checkout, as we deliver to the address you provide. We are unable to change the delivery address once your order has been dispatched.",
            "Someone at the delivery address should be available to receive the parcel. If our courier cannot deliver after repeated attempts, the parcel will be returned to us and we may charge a re-delivery fee.",
          ],
        },
        {
          heading: "Collect in store",
          paragraphs: [
            "You're welcome to collect your order from us at Corner R25 and Philadelphia Hospital Road, Elandsdoorn, Dennilton, Limpopo, 1030. Simply choose 'Collect' at checkout and wait for our collection-ready email or WhatsApp before coming in.",
          ],
        },
        {
          heading: "Damaged or lost parcels",
          paragraphs: [
            "If your parcel arrives damaged or items are missing, please note this with the courier if possible and contact us within 48 hours of delivery so we can resolve it quickly. See our Return Policy for items damaged on delivery.",
          ],
        },
      ]}
    />
  );
}

