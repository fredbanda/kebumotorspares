import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, newRole } = await req.json()
  if (!['admin', 'customer'].includes(newRole)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

  await pool.query(`UPDATE "user" SET "role" = $1 WHERE "id" = $2`, [newRole, id])
  return NextResponse.json({ ok: true })
}
