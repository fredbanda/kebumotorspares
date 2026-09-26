import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/prisma/db'

export async function GET() {
  const orders = await db.orm.public.Order
    .orderBy((o) => o.createdAt.desc())
    .include('user', (u) => u.select('name', 'email'))
    .include('orderItems', (i) => i.select('id'))
    .all()
  return NextResponse.json(orders)
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  await db.orm.public.Order.where({ id }).update({ status })
  return NextResponse.json({ ok: true })
}
