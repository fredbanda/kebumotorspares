import { NextResponse } from 'next/server'

// Discounts table will be available after: pnpm prisma migrate dev && pnpm prisma contract emit
export async function GET() {
  return NextResponse.json([])
}

export async function POST() {
  return NextResponse.json({ error: 'Run migration first' }, { status: 503 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Run migration first' }, { status: 503 })
}
