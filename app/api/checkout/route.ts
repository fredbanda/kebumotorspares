import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { buildPayFastSignature, getPayFastConfig } from "@/lib/payfast";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

function getBaseUrl(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const { userId, cart, total, shipping } = (await req.json()) as {
      userId: string;
      cart: CartItem[];
      total: number;
      shipping: {
        name: string;
        email: string;
        address: string;
        city: string;
        zip: string;
      };
    };

    if (!userId || !cart?.length || !Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!shipping?.email) {
      return NextResponse.json({ error: "Shipping email is required" }, { status: 400 });
    }

    // Ensure an app user record exists (auth users live in better-auth "user" table).
    let appUser = await db.user.findUnique({ where: { id: userId } });
    if (!appUser) {
      appUser = await db.user.findUnique({ where: { email: shipping.email } });
    }
    if (!appUser) {
      appUser = await db.user.create({
        data: {
          id: userId,
          email: shipping.email,
          name: shipping.name || null,
          address: shipping.address
            ? [shipping.address, shipping.city, shipping.zip].filter(Boolean).join(", ")
            : null,
        },
      });
    }

    // Create pending order
    const order = await db.order.create({
      data: {
        userId: appUser.id,
        productId: cart[0].productId,
        quantity: cart.reduce((s, i) => s + i.quantity, 0),
        total,
        status: "pending",
      },
    });

    await Promise.all(
      cart.map((item) =>
        db.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            total: item.price * item.quantity,
            fulfillmentStatus: "pending",
            paymentStatus: "pending",
            deliveryStatus: "pending",
          },
        })
      )
    );

    const { merchantId, merchantKey, passphrase, baseUrl } = getPayFastConfig();
    const appUrl = getBaseUrl(req);

    const data: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${appUrl}/?payment=success&orderId=${order.id}`,
      cancel_url: `${appUrl}/?payment=cancelled&orderId=${order.id}`,
      notify_url: `${appUrl}/api/payfast/notify`,
      name_first: shipping?.name?.split(" ")[0]?.slice(0, 100) || "Customer",
      name_last: shipping?.name?.split(" ").slice(1).join(" ").slice(0, 100) || "",
      email_address: shipping?.email || "",
      m_payment_id: order.id,
      amount: total.toFixed(2),
      item_name: `Kebu Motor Spares Order ${order.id.slice(0, 8)}`,
      item_description: `${cart.length} item(s)`,
      custom_str1: order.id,
    };

    const signature = buildPayFastSignature(data, passphrase);

    return NextResponse.json({
      orderId: order.id,
      processUrl: baseUrl,
      fields: { ...data, signature },
    });
  } catch (err) {
    console.error("[checkout]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

