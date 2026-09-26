import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/prisma/db'

export async function GET() {
  const returns = await db.orm.public.Returns
    .select('id', 'orderId', 'userId', 'reason', 'status', 'createdAt')
    .orderBy((r) => r.createdAt.desc())
    .include('user', (u) => u.select('name'))
    .all()
  return NextResponse.json(returns)
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  await db.orm.public.Returns.where({ id }).update({ status })
  return NextResponse.json({ ok: true })
}
