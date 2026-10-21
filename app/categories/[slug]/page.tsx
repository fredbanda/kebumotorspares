import { db } from "@/prisma/db";
import { Storefront } from "@/components/storefront";
import { mapDbProduct } from "@/lib/mapProduct";
import type { Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const products = (await db.product.findMany({
    orderBy: { createdAt: "desc" },
  })).map(mapDbProduct) as Product[];

  return <Storefront initialProducts={products} initialCategory={params.slug} />;
}
