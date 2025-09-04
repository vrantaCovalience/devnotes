import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || undefined;

  const where: any = {
    userId: session.userId,
  };
  if (category && category !== "all") {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  const notes = await prisma.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  // Get categories with counts
  const categories = await prisma.note.groupBy({
    by: ["category"],
    where: { userId: session.userId },
    _count: { category: true },
  });

  return NextResponse.json({
    notes,
    categories: categories.map((c) => ({
      name: c.category,
      count: c._count.category,
    })),
  });
}
