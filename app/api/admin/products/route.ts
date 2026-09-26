import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/prisma/db'

export async function GET() {
  const products = await db.orm.public.Product.orderBy((p) => p.createdAt.desc()).all()
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
  const sku = body.sku?.trim() || slug.toUpperCase().slice(0, 20)
  const product = await db.orm.public.Product.create({
    name: body.name,
    slug,
    sku,
    category: body.category,
    description: body.description ?? null,
    imageUrl: body.imageUrl ?? null,
    price: Number(body.price),
    costPrice: body.costPrice ? Number(body.costPrice) : null,
    active: true,
  })
  return NextResponse.json(product, { status: 201 })
}
