import { NextResponse } from 'next/server'
import { db } from '@/prisma/db'

export async function GET() {
  const users = await db.orm.public.User
    .orderBy((u) => u.createdAt.desc())
    .include('orders', (o) => o.select('total'))
    .all()
  const customers = users.map((u) => ({
    id: u.id,
    name: u.name ?? u.email,
    email: u.email,
    orders: u.orders.length,
    totalSpent: u.orders.reduce((s, o) => s + o.total, 0),
    joinedAt: (u.createdAt as string).slice(0, 10),
  }))
  return NextResponse.json(customers)
}
