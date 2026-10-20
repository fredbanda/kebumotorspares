import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  const returns = await db.returns.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json(returns);
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  await db.returns.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ ok: true });
}

