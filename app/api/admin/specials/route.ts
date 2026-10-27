import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  const specials = await db.special.findMany({
    include: {
      product: {
        select: { id: true, name: true, price: true, imageUrl: true },
      },
      relatedProducts: {
        include: {
          product: {
            select: { id: true, name: true, price: true, imageUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(specials);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const special = await db.special.create({
      data: {
        productId: body.productId,
        originalPrice: Number(body.originalPrice),
        salePrice: Number(body.salePrice),
        discountPercentage: Number(body.discountPercentage),
        active: body.active ?? true,
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        endsAt: body.endsAt ? new Date(body.endsAt) : null,
      },
      include: {
        product: {
          select: { id: true, name: true, price: true, imageUrl: true },
        },
      },
    });
    return NextResponse.json(special, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create special" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    const special = await db.special.update({
      where: { id },
      data: {
        originalPrice: updateData.originalPrice ? Number(updateData.originalPrice) : undefined,
        salePrice: updateData.salePrice ? Number(updateData.salePrice) : undefined,
        discountPercentage: updateData.discountPercentage ? Number(updateData.discountPercentage) : undefined,
        active: updateData.active,
        startsAt: updateData.startsAt ? new Date(updateData.startsAt) : undefined,
        endsAt: updateData.endsAt ? new Date(updateData.endsAt) : undefined,
      },
      include: {
        product: {
          select: { id: true, name: true, price: true, imageUrl: true },
        },
        relatedProducts: {
          include: {
            product: {
              select: { id: true, name: true, price: true, imageUrl: true },
            },
          },
        },
      },
    });

    return NextResponse.json(special);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update special" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Special ID is required" },
        { status: 400 }
      );
    }

    await db.specialRelatedProduct.deleteMany({
      where: { specialId: id },
    });

    await db.special.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete special" },
      { status: 500 }
    );
  }
}
