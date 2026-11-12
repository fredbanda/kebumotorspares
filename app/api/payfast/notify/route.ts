import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getPayFastConfig, verifyPayFastSignature } from "@/lib/payfast";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const data: Record<string, string> = {};
    form.forEach((value, key) => {
      data[key] = String(value);
    });

    const { passphrase, validateUrl } = getPayFastConfig();

    if (!verifyPayFastSignature(data, passphrase)) {
      console.error("[payfast/notify] invalid signature");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Validate with PayFast server
    const params = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (k !== "signature") params.append(k, v);
    });
    const validateRes = await fetch(validateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const validateText = await validateRes.text();
    if (!validateRes.ok || !validateText.trim().startsWith("VALID")) {
      console.error("[payfast/notify] server validation failed", validateText);
      return new NextResponse("Invalid", { status: 400 });
    }

    const paymentStatus = data.payment_status;
    const orderId = data.custom_str1 || data.m_payment_id;
    const amountGross = Number(data.amount_gross || data.amount || 0);
    const pfPaymentId = data.pf_payment_id || data.m_payment_id || "";

    if (!orderId) {
      return new NextResponse("Missing order id", { status: 400 });
    }

    if (paymentStatus !== "COMPLETE") {
      // record failed/cancelled state if desired; acknowledge ITN
      console.log("[payfast/notify] non-complete status", paymentStatus, orderId);
      return new NextResponse("OK", { status: 200 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true, payments: true },
    });
    if (!order) {
      console.error("[payfast/notify] order not found", orderId);
      return new NextResponse("Order not found", { status: 404 });
    }

    // Idempotency: if already paid/recorded, acknowledge
    if (order.status === "processing" || order.payments.some((p) => p.paymentId === pfPaymentId)) {
      return new NextResponse("OK", { status: 200 });
    }

    if (Math.abs(amountGross - order.total) > 0.01) {
      console.error("[payfast/notify] amount mismatch", amountGross, order.total);
      return new NextResponse("Amount mismatch", { status: 400 });
    }

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "processing" },
      });
      await tx.orderItem.updateMany({
        where: { orderId: order.id },
        data: { paymentStatus: "paid" },
      });
      await tx.payment.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          amount: order.total,
          status: "paid",
          paymentId: pfPaymentId,
          paymentMethod: "payfast",
        },
      });
      const existingSale = await tx.sale.findUnique({ where: { orderId: order.id } });
      if (!existingSale) {
        await tx.sale.create({
          data: {
            orderId: order.id,
            revenue: order.total,
            channel: "online",
          },
        });
      }
    });

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("[payfast/notify]", err);
    return new NextResponse("Server error", { status: 500 });
  }
}