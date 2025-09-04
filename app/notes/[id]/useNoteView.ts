import { useRouter } from "next/navigation";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useNoteView(note: Note) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(note.completed);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleCompleted = async () => {
    setIsUpdatingStatus(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note status");
      }

      setIsCompleted(!isCompleted);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error("Error updating note status:", error);
      setError("Failed to update note status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setError(null);
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteConfirm(false);
      setError(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      // Redirect to dashboard after successful deletion
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
      setIsDeleting(false);
    }
  };

  return {
    isCompleted,
    isUpdatingStatus,
    isDeleting,
    showDeleteConfirm,
    error,
    formatDate,
    handleToggleCompleted,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
}
