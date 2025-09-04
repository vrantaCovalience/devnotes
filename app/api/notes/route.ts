import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// TypeScript interfaces following project conventions
interface ICreateNoteRequest {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  pinned?: boolean;
}

interface INotesResponse {
  success: boolean;
  data?: any[];
  message?: string;
  error?: string;
}

interface INoteResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// GET /api/notes - Fetch all notes for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Server-side session verification (mandatory)
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const archived = searchParams.get("archived");
    const pinned = searchParams.get("pinned");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    // Build filter object
    const where: any = {
      userId: session.userId,
    };

    if (category) {
      where.category = category;
    }

    if (archived !== null) {
      where.archived = archived === "true";
    }

    if (pinned !== null) {
      where.pinned = pinned === "true";
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    // Fetch notes with pagination
    const notes = await prisma.note.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    });

    const response: INotesResponse = {
      success: true,
      data: notes,
      message: `Found ${notes.length} notes`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("GET /api/notes error:", error);
    const response: INotesResponse = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/notes - Create new note
export async function POST(request: NextRequest) {
  try {
    // Server-side session verification (mandatory)
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body: ICreateNoteRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { title, content, category, tags, pinned } = body;

    // Input validation
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Title and content cannot be empty" },
        { status: 400 }
      );
    }

    // Create new note using Prisma
    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category?.trim() || null,
        tags: tags || [],
        pinned: pinned || false,
        userId: session.userId,
      },
    });

    const response: INoteResponse = {
      success: true,
      data: note,
      message: "Note created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    const response: INoteResponse = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
