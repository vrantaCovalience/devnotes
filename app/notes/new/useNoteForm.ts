"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NoteFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface UseNoteFormReturn {
  formData: NoteFormData;
  isSubmitting: boolean;
  error: string | null;
  handleChange: (name: keyof NoteFormData, value: string | string[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  clearDraft: () => void;
}

export function useNoteForm(): UseNoteFormReturn {
  const router = useRouter();
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    content: "",
    category: "general",
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  // Auto-save draft to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("note-draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (err) {
        console.error("Failed to parse saved draft:", err);
      }
    }
  }, []);

  // Save draft whenever formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.title || formData.content) {
        localStorage.setItem("note-draft", JSON.stringify(formData));
      }
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const clearDraft = () => {
    localStorage.removeItem("note-draft");
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create note");
      }

      // Clear draft after successful creation
      clearDraft();
      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    addTag,
    removeTag,
    tagInput,
    setTagInput,
    clearDraft,
  };
}
