import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// TypeScript interfaces following project conventions
interface IUpdateNoteRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  pinned?: boolean;
  archived?: boolean;
}

interface INoteResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// GET /api/notes/[id] - Fetch single note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Server-side session verification (mandatory)
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate note ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Fetch note with user ownership verification
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: session.userId, // Ensure user owns the note
      },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    const response: INoteResponse = {
      success: true,
      data: note,
      message: "Note retrieved successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("GET /api/notes/[id] error:", error);
    const response: INoteResponse = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/notes/[id] - Update note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Server-side session verification (mandatory)
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate note ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body: IUpdateNoteRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Check if note exists and user owns it
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    // Validate update data
    const updateData: any = {};

    if (body.title !== undefined) {
      if (body.title.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }

    if (body.content !== undefined) {
      if (body.content.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Content cannot be empty" },
          { status: 400 }
        );
      }
      updateData.content = body.content.trim();
    }

    if (body.category !== undefined) {
      updateData.category = body.category?.trim() || null;
    }

    if (body.tags !== undefined) {
      updateData.tags = body.tags || [];
    }

    if (body.pinned !== undefined) {
      updateData.pinned = body.pinned;
    }

    if (body.archived !== undefined) {
      updateData.archived = body.archived;
    }

    // Update note using Prisma
    const updatedNote = await prisma.note.update({
      where: { id },
      data: updateData,
    });

    const response: INoteResponse = {
      success: true,
      data: updatedNote,
      message: "Note updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("PUT /api/notes/[id] error:", error);
    const response: INoteResponse = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/notes/[id] - Delete note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Server-side session verification (mandatory)
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate note ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Check if note exists and user owns it
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    // Delete note using Prisma
    await prisma.note.delete({
      where: { id },
    });

    const response: INoteResponse = {
      success: true,
      message: "Note deleted successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error);
    const response: INoteResponse = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
