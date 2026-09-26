import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/prisma/db'

interface CartItem {
  productId: string
  quantity: number
  price: number
}

export async function POST(req: NextRequest) {
  try {
    const { token, userId, cart, total, shipping } = await req.json() as {
      token: string
      userId: string
      cart: CartItem[]
      total: number
      shipping: { name: string; email: string; address: string; city: string; zip: string }
    }

    if (!token || !userId || !cart?.length) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Charge via Yoco
    const yocoRes = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'X-Auth-Secret-Key': process.env.YOCO_SECRET_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        amountInCents: Math.round(total * 100),
        currency: 'ZAR',
      }),
    })

    const charge = await yocoRes.json()

    if (!yocoRes.ok || charge.status !== 'successful') {
      return NextResponse.json({ error: charge.displayMessage ?? 'Payment declined' }, { status: 402 })
    }

    // Create order
    const order = await db.orm.public.Order.create({
      userId,
      productId: cart[0].productId,
      quantity: cart.reduce((s, i) => s + i.quantity, 0),
      total,
      status: 'processing',
    })

    // Create order items
    await Promise.all(
      cart.map((item) =>
        db.orm.public.OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          total: item.price * item.quantity,
          fulfillmentStatus: 'pending',
          paymentStatus: 'paid',
          deliveryStatus: 'pending',
        })
      )
    )

    // Record payment
    await db.orm.public.Payment.create({
      userId,
      orderId: order.id,
      amount: total,
      status: 'paid',
      paymentId: charge.id,
      paymentMethod: 'yoco',
    })

    // Record sale for dashboard
    await db.orm.public.Sale.create({
      orderId: order.id,
      revenue: total,
      channel: 'online',
    })

    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
