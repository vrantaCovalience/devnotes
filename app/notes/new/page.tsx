import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NoteForm } from "./NoteForm";

export default async function NewNotePage() {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return <NoteForm />;
}
