import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/prisma/db'
import { starterProducts, Product } from '@/lib/catalog'

export async function GET(req: NextRequest) {
  const dbProducts = await db.orm.public.Product.orderBy((p) => p.createdAt.desc()).all()

  const dbNames = new Set(dbProducts.map((p) => p.name.toLowerCase()))

  const mappedDbProducts: Product[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    costPrice: p.costPrice ?? undefined,
    rating: 5,
    stock: p.active ? 1 : 0,
    sku: p.sku,
    badge: undefined,
    description: p.description ?? '',
    image: p.imageUrl ?? '',
    active: p.active,
  }))

  const seedProducts = starterProducts.filter((p) => !dbNames.has(p.name.toLowerCase()))

  const allProducts: Product[] = [...mappedDbProducts, ...seedProducts]

  return NextResponse.json(allProducts)
}