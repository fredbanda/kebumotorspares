import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { name, email, password, token } = await req.json()

  if (!token || token !== process.env.ADMIN_INVITE_TOKEN) {
    return NextResponse.json({ error: 'Invalid invite token.' }, { status: 403 })
  }

  // Check if user already exists in better-auth's table
  const existing = await pool.query(`SELECT id FROM "user" WHERE email = $1`, [email])

  let userId: string

  if (existing.rows.length > 0) {
    // Already registered — just promote
    userId = existing.rows[0].id
  } else {
    const { data, error } = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: req.headers,
    })
    if (error || !data?.user) {
      console.error('[admin/register] signUpEmail error:', error)
      return NextResponse.json({ error: error?.message ?? 'Registration failed.' }, { status: 400 })
    }
    userId = data.user.id
  }

  await pool.query(`UPDATE "user" SET "role" = 'admin' WHERE "id" = $1`, [userId])

  return NextResponse.json({ ok: true })
}
