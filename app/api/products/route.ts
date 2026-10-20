import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { mapDbProduct } from "@/lib/mapProduct";
import type { Product } from "@/lib/catalog";

export async function GET(_req: NextRequest): Promise<Response> {
  const products = (await db.product.findMany({
    orderBy: { createdAt: "desc" },
  }))
    .map(mapDbProduct) as Product[];

  return NextResponse.json(products);
}
