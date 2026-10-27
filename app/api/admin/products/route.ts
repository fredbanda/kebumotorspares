import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { hasTable } from "@/lib/db-capabilities";

export async function GET() {
  const inventoryTableExists = await hasTable("inventory");
  const products = inventoryTableExists
    ? await db.product.findMany({
        include: {
          inventory: { select: { quantity: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : await db.product.findMany({
        orderBy: { createdAt: "desc" },
      });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const inventoryTableExists = await hasTable("inventory");
  const body = await req.json();
  const slug =
    body.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") +
    "-" +
    Date.now();
  const sku = body.sku?.trim() || slug.toUpperCase().slice(0, 20);
  const product = await db.product.create({
    data: inventoryTableExists
      ? {
          name: body.name,
          slug,
          sku,
          category: body.category,
          description: body.description ?? null,
          imageUrl: body.imageUrl ?? body.image ?? null,
          price: Number(body.price),
          costPrice: body.costPrice ? Number(body.costPrice) : null,
          active: true,
          inventory: {
            create: {
              quantity: Number(body.stock ?? 0),
            },
          },
        }
      : {
          name: body.name,
          slug,
          sku,
          category: body.category,
          description: body.description ?? null,
          imageUrl: body.imageUrl ?? body.image ?? null,
          price: Number(body.price),
          costPrice: body.costPrice ? Number(body.costPrice) : null,
          active: true,
        },
    include: inventoryTableExists
      ? {
          inventory: { select: { quantity: true } },
        }
      : undefined,
  });
  return NextResponse.json(product, { status: 201 });
}
