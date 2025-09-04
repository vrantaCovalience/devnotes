"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, ChevronLeft, Edit, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useNoteView } from "./useNoteView";

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

interface NoteViewClientProps {
  note: Note;
}

export function NoteViewClient({ note }: NoteViewClientProps) {
  const {
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
  } = useNoteView(note);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Note Content */}
      <Card>
        <CardHeader>
          {error && (
            <div className="mb-4 bg-destructive/15 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                {note.title}
                {isCompleted && (
                  <Badge
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{note.category}</Badge>
                {note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              variant={isCompleted ? "outline" : "default"}
              size="sm"
              onClick={handleToggleCompleted}
              disabled={isUpdatingStatus}
              className={
                isCompleted
                  ? "text-green-600 border-green-600 hover:bg-green-50"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {isUpdatingStatus ? (
                <>
                  {isCompleted ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Updating...
                </>
              ) : (
                <>
                  {isCompleted ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                </>
              )}
            </Button>

            <Button asChild variant="outline" size="sm">
              <Link href={`/notes/${note.id}/edit` as any}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="text-red-600 border-red-600 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Note Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {note.content}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-6 border-t text-sm text-muted-foreground space-y-1">
            <div>Created: {formatDate(note.createdAt)}</div>
            <div>Last updated: {formatDate(note.updatedAt)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={handleDeleteCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{note.title}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
