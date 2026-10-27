import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { specialId, productId } = body;

    const relatedProduct = await db.specialRelatedProduct.create({
      data: {
        specialId,
        productId,
      },
      include: {
        product: {
          select: { id: true, name: true, price: true, imageUrl: true },
        },
      },
    });

    return NextResponse.json(relatedProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add related product" },
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
        { error: "Related product ID is required" },
        { status: 400 }
      );
    }

    await db.specialRelatedProduct.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove related product" },
      { status: 500 }
    );
  }
}
