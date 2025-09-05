# DevNotes Development Tasks

## What Needs to Be Done

### 1. 🗄️ Database Schema (Notes Model)
- [x] Add Note model to Prisma schema
- [x] Define relationships between User and Note models
- [x] Add fields for title, content, category, tags
- [x] Include metadata fields (archived, pinned, timestamps)
- [x] Generate Prisma client
- [x] Run database migration
- [x] Test schema with seed data

### 2. 🔌 Basic Notes API
- [x] Create GET /api/notes endpoint (fetch all notes)
- [x] Create GET /api/notes/[id] endpoint (fetch single note)
- [x] Create POST /api/notes endpoint (create new note)
- [x] Create PUT /api/notes/[id] endpoint (update note)
- [x] Create DELETE /api/notes/[id] endpoint (delete note)
- [x] Add proper error handling and validation
- [x] Implement authentication middleware


### 3. 📊 Dashboard with Notes Listing
- [ ] Create dashboard page showing all notes
- [ ] Add search functionality
- [ ] Add filter options (category, date, tags)
- [ ] Implement pagination

### 4. ✏️ Note Creation
- [ ] Create "New Note" page
- [ ] Add rich text editor
- [ ] Implement save functionality
- [ ] Add category selection
- [ ] Add tags input
- [ ] Add auto-save feature

### 5. 📝 Note Editing
- [ ] Create note view/edit page
- [ ] Pre-fill form with existing note data
- [ ] Add update functionality
- [ ] Show saving status
- [ ] Warn about unsaved changes

### 6. 🗂️ Note Management
- [ ] Add delete confirmation modal
- [ ] Implement bulk selection (checkboxes)
- [ ] Add bulk delete functionality
- [ ] Create categories system
- [ ] Add archive/unarchive functionality
- [ ] Implement pin/unpin notes

### 7. 🌙 Dark/Light Mode
- [ ] use ShadCn themeProvider.
- [ ] Add theme toggle button
- [ ] Update components for dark mode support
- [ ] Configure Tailwind for dark mode
