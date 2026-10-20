import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: { select: { id: true } },
    },
  });
  return NextResponse.json(orders);
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  await db.order.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ ok: true });
}

