"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Note } from "./actions";

export interface UseNotesTableManagementReturn {
  selectedNotes: string[];
  showDeleteDialog: boolean;
  isDeleting: boolean;
  isArchiving: boolean;
  isPinning: boolean;
  formatDate: (dateString: string) => string;
  handleSelectNote: (noteId: string) => void;
  handleSelectAll: () => void;
  handleDeleteSelected: () => void;
  handleArchiveSelected: () => void;
  handlePinSelected: () => void;
  handleSingleAction: (
    action: "pin" | "archive" | "delete",
    noteId: string,
    value?: boolean
  ) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
  clearSelection: () => void;
}

export function useNotesTableManagement(
  notes: Note[]
): UseNotesTableManagementReturn {
  const router = useRouter();
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const handleSelectNote = useCallback((noteId: string) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedNotes.length === notes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notes.map((note) => note.id));
    }
  }, [selectedNotes.length, notes]);

  const clearSelection = useCallback(() => {
    setSelectedNotes([]);
  }, []);

  const updateNotesAction = useCallback(
    async (noteIds: string[], updates: any) => {
      try {
        const promises = noteIds.map((id) =>
          fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          })
        );

        const responses = await Promise.all(promises);
        const allSuccessful = responses.every((response) => response.ok);

        if (!allSuccessful) {
          throw new Error("Some notes failed to update");
        }

        // Refresh the page to show updated data
        router.refresh();
        clearSelection();
      } catch (error) {
        console.error("Failed to update notes:", error);
        throw error;
      }
    },
    [router, clearSelection]
  );

  const deleteNotesAction = useCallback(
    async (noteIds: string[]) => {
      try {
        const promises = noteIds.map((id) =>
          fetch(`/api/notes/${id}`, {
            method: "DELETE",
          })
        );

        const responses = await Promise.all(promises);
        const allSuccessful = responses.every((response) => response.ok);

        if (!allSuccessful) {
          throw new Error("Some notes failed to delete");
        }

        // Refresh the page to show updated data
        router.refresh();
        clearSelection();
      } catch (error) {
        console.error("Failed to delete notes:", error);
        throw error;
      }
    },
    [router, clearSelection]
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedNotes.length > 0) {
      setShowDeleteDialog(true);
    }
  }, [selectedNotes.length]);

  const confirmDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteNotesAction(selectedNotes);
      setShowDeleteDialog(false);
    } catch (error) {
      // Error already logged in deleteNotesAction
    } finally {
      setIsDeleting(false);
    }
  }, [selectedNotes, deleteNotesAction]);

  const cancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleArchiveSelected = useCallback(async () => {
    if (selectedNotes.length === 0) return;

    setIsArchiving(true);
    try {
      // Toggle archive status - if any selected note is not archived, archive all; otherwise unarchive all
      const selectedNoteData = notes.filter((note) =>
        selectedNotes.includes(note.id)
      );
      const hasUnarchived = selectedNoteData.some((note) => !note.archived);

      await updateNotesAction(selectedNotes, { archived: hasUnarchived });
    } catch (error) {
      // Error already logged in updateNotesAction
    } finally {
      setIsArchiving(false);
    }
  }, [selectedNotes, notes, updateNotesAction]);

  const handlePinSelected = useCallback(async () => {
    if (selectedNotes.length === 0) return;

    setIsPinning(true);
    try {
      // Toggle pin status - if any selected note is not pinned, pin all; otherwise unpin all
      const selectedNoteData = notes.filter((note) =>
        selectedNotes.includes(note.id)
      );
      const hasUnpinned = selectedNoteData.some((note) => !note.pinned);

      await updateNotesAction(selectedNotes, { pinned: hasUnpinned });
    } catch (error) {
      // Error already logged in updateNotesAction
    } finally {
      setIsPinning(false);
    }
  }, [selectedNotes, notes, updateNotesAction]);

  const handleSingleAction = useCallback(
    async (
      action: "pin" | "archive" | "delete",
      noteId: string,
      value?: boolean
    ) => {
      if (action === "delete") {
        setSelectedNotes([noteId]);
        setShowDeleteDialog(true);
        return;
      }

      try {
        if (action === "pin") {
          await updateNotesAction([noteId], { pinned: value });
        } else if (action === "archive") {
          await updateNotesAction([noteId], { archived: value });
        }
      } catch (error) {
        // Error already logged in updateNotesAction
      }
    },
    [updateNotesAction]
  );

  return {
    selectedNotes,
    showDeleteDialog,
    isDeleting,
    isArchiving,
    isPinning,
    formatDate,
    handleSelectNote,
    handleSelectAll,
    handleDeleteSelected,
    handleArchiveSelected,
    handlePinSelected,
    handleSingleAction,
    confirmDelete,
    cancelDelete,
    clearSelection,
  };
}
