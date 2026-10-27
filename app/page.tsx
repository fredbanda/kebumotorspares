import { Storefront } from "@/components/storefront";
import { db } from "@/prisma/db";
import { mapDbProduct } from "@/lib/mapProduct";
import { hasTable } from "@/lib/db-capabilities";
import type { Product, Special } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Page() {
  const specialsExist = await hasTable("specials");
  const now = new Date();

  const [products, rawSpecials] = await Promise.all([
    db.product.findMany({ orderBy: { createdAt: "desc" } }).then((p) => p.map(mapDbProduct) as Product[]),
    specialsExist
      ? db.special.findMany({
          where: {
            active: true,
            OR: [{ startsAt: null }, { startsAt: { lte: now } }],
            AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
          },
        })
      : [],
  ]);

  const specials: Special[] = rawSpecials.map((s: any) => ({
    id: s.id,
    productId: s.productId,
    originalPrice: s.originalPrice,
    salePrice: s.salePrice,
    discountPercentage: s.discountPercentage,
    active: s.active,
    startsAt: s.startsAt?.toISOString(),
    endsAt: s.endsAt?.toISOString(),
  }));

  return <Storefront initialProducts={products} initialSpecials={specials} />;
}
