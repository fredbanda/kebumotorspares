import { NextResponse } from 'next/server'

// Sales table will be available after: pnpm prisma migrate dev && pnpm prisma contract emit
export async function GET() {
  return NextResponse.json([])
}
