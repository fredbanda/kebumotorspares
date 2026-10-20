import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.description !== undefined)
    updateData.description = body.description ?? null;
  if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl ?? null;
  if (body.price !== undefined) updateData.price = Number(body.price);
  if (body.costPrice !== undefined)
    updateData.costPrice = body.costPrice ? Number(body.costPrice) : null;
  if (body.active !== undefined) updateData.active = body.active;

  const product = await db.product.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(product);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.product.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}

