import { db } from '@/prisma/db'
import { starterProducts } from '@/lib/catalog'

async function main() {
  const existing = await db.orm.public.Product.count()
  if (existing > 0) {
    console.log(`Products already exist (${existing}). Skipping seed.`)
    return
  }

  for (const p of starterProducts) {
    await db.orm.public.Product.create({
      name: p.name,
      slug: p.id,
      sku: p.sku,
      category: p.category,
      description: p.description ?? null,
      imageUrl: p.image ?? null,
      price: p.price,
      costPrice: p.costPrice ?? null,
      active: true,
    })
  }

  console.log(`Seeded ${starterProducts.length} products.`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})