import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { NoteViewClient } from "./NoteViewClient";

interface NoteViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteViewPage({ params }: NoteViewPageProps) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  try {
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!note) {
      notFound();
    }

    return <NoteViewClient note={note} />;
  } catch (error) {
    console.error("Error fetching note:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: NoteViewPageProps) {
  const { id } = await params;

  const session = await verifySession();
  if (!session) {
    return {
      title: "Note Not Found - DevNotes",
    };
  }

  try {
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: session.userId,
      },
      select: {
        title: true,
      },
    });

    return {
      title: note ? `${note.title} - DevNotes` : "Note Not Found - DevNotes",
    };
  } catch {
    return {
      title: "Note Not Found - DevNotes",
    };
  }
}
