"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

interface NoteFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface UseNoteEditReturn {
  formData: NoteFormData;
  isSubmitting: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
  saveStatus: "saving" | "saved" | "error" | null;
  handleChange: (name: keyof NoteFormData, value: string | string[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  handleSaveDraft: () => Promise<void>;
}

export function useNoteEdit(note: Note): UseNoteEditReturn {
  const router = useRouter();
  const [originalData] = useState<NoteFormData>({
    title: note.title,
    content: note.content,
    category: note.category,
    tags: note.tags,
  });

  const [formData, setFormData] = useState<NoteFormData>({
    title: note.title,
    content: note.content,
    category: note.category,
    tags: note.tags,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "saving" | "saved" | "error" | null
  >(null);
  const [tagInput, setTagInput] = useState("");

  // Check if there are unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(formData) !== JSON.stringify(originalData);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges || isSaving || isSubmitting) return;

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          completed: note.completed, // Preserve completion status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      setSaveStatus("saved");
      // Update original data to reflect saved state
      setFormData((prev) => ({ ...prev }));
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      // Clear save status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);
    }
  }, [
    formData,
    hasUnsavedChanges,
    isSaving,
    isSubmitting,
    note.id,
    note.completed,
  ]);

  // Auto-save with debounce
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      autoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, autoSave, hasUnsavedChanges]);

  // Warn about unsaved changes before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSaving) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, isSaving]);

  const handleChange = (name: keyof NoteFormData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSaveDraft = async () => {
    await autoSave();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          completed: note.completed, // Preserve completion status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update note");
      }

      // Redirect to note view on success
      router.push(`/notes/${note.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    isSaving,
    hasUnsavedChanges,
    error,
    saveStatus,
    handleChange,
    handleSubmit,
    addTag,
    removeTag,
    tagInput,
    setTagInput,
    handleSaveDraft,
  };
}
