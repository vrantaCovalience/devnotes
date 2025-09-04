"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Archive,
  ArchiveRestore,
  Check,
  Edit,
  Eye,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { Note } from "./actions";
import { useNotesTableManagement } from "./useNotesTableManagement";

interface NotesTableProps {
  notes: Note[];
  searchTerm?: string;
  selectedCategory?: string;
}

export function NotesTableManagement({
  notes,
  searchTerm,
  selectedCategory,
}: NotesTableProps) {
  const {
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
  } = useNotesTableManagement(notes);

  const isAllSelected =
    notes.length > 0 && selectedNotes.length === notes.length;
  const hasSelectedNotes = selectedNotes.length > 0;

  // Sort notes: pinned first, then by creation date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notes ({notes.length})</CardTitle>
            {hasSelectedNotes && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedNotes.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleArchiveSelected}
                  disabled={isArchiving}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  {isArchiving ? "Archiving..." : "Archive"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePinSelected}
                  disabled={isPinning}
                >
                  <Pin className="w-4 h-4 mr-1" />
                  {isPinning ? "Pinning..." : "Pin/Unpin"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || (selectedCategory && selectedCategory !== "all")
                ? "No notes found matching your criteria."
                : "No notes yet. Create your first note to get started!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all notes"
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedNotes.map((note) => (
                    <TableRow
                      key={note.id}
                      className={note.archived ? "opacity-60" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedNotes.includes(note.id)}
                          onCheckedChange={() => handleSelectNote(note.id)}
                          aria-label={`Select note ${note.title}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {note.pinned && (
                            <Pin className="w-4 h-4 text-blue-500" />
                          )}
                          {note.archived && (
                            <Archive className="w-4 h-4 text-gray-500" />
                          )}
                          <div>
                            <div className="font-medium">{note.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {note.content}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{note.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {note.completed ? (
                            <Badge
                              variant="default"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline">In Progress</Badge>
                          )}
                          {note.archived && (
                            <Badge variant="secondary" className="text-xs">
                              Archived
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(note.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/notes/${note.id}` as any}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/notes/${note.id}/edit` as any}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSingleAction(
                                    "pin",
                                    note.id,
                                    !note.pinned
                                  )
                                }
                              >
                                {note.pinned ? (
                                  <>
                                    <PinOff className="w-4 h-4 mr-2" />
                                    Unpin Note
                                  </>
                                ) : (
                                  <>
                                    <Pin className="w-4 h-4 mr-2" />
                                    Pin Note
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSingleAction(
                                    "archive",
                                    note.id,
                                    !note.archived
                                  )
                                }
                              >
                                {note.archived ? (
                                  <>
                                    <ArchiveRestore className="w-4 h-4 mr-2" />
                                    Unarchive Note
                                  </>
                                ) : (
                                  <>
                                    <Archive className="w-4 h-4 mr-2" />
                                    Archive Note
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSingleAction("delete", note.id)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Note
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Notes</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedNotes.length} note
              {selectedNotes.length === 1 ? "" : "s"}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
