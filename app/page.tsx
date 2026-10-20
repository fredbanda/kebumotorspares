import { Storefront } from "@/components/storefront";
import { db } from "@/prisma/db";
import { mapDbProduct } from "@/lib/mapProduct";
import type { Product } from "@/lib/catalog";

export default async function Page() {
  const products = (await db.product.findMany({
    orderBy: { createdAt: "desc" },
  })).map(mapDbProduct) as Product[];

  return <Storefront initialProducts={products} />;
}
