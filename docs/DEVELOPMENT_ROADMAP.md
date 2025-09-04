# DevNotes Development Tasks

## 📋 What Needs to Be Done

### 1. 🗄️ Database Schema (Notes Model)
- [ ] Add Note model to Prisma schema
- [ ] Define relationships between User and Note models
- [ ] Add fields for title, content, category, tags
- [ ] Include metadata fields (archived, pinned, timestamps)
- [ ] Generate Prisma client
- [ ] Run database migration
- [ ] Test schema with seed data

### 2. 🔌 Basic Notes API
- [ ] Create GET /api/notes endpoint (fetch all notes)
- [ ] Create GET /api/notes/[id] endpoint (fetch single note)
- [ ] Create POST /api/notes endpoint (create new note)
- [ ] Create PUT /api/notes/[id] endpoint (update note)
- [ ] Create DELETE /api/notes/[id] endpoint (delete note)
- [ ] Add proper error handling and validation
- [ ] Implement authentication middleware
- [ ] Test all endpoints with sample data

### 3. 🌙 Dark/Light Mode
- [ ] use ShadCn themeProvider.
- [ ] Add theme toggle button
- [ ] Update components for dark mode support
- [ ] Configure Tailwind for dark mode

### 4. 📊 Dashboard with Notes Listing
- [ ] Create dashboard page showing all notes
- [ ] Add search functionality
- [ ] Add filter options (category, date, tags)
- [ ] Implement pagination

### 5. ✏️ Note Creation
- [ ] Create "New Note" page
- [ ] Add rich text editor
- [ ] Implement save functionality
- [ ] Add category selection
- [ ] Add tags input
- [ ] Add auto-save feature

### 6. 📝 Note Editing
- [ ] Create note view/edit page
- [ ] Pre-fill form with existing note data
- [ ] Add update functionality
- [ ] Show saving status
- [ ] Warn about unsaved changes

### 7. 🗂️ Note Management
- [ ] Add delete confirmation modal
- [ ] Implement bulk selection (checkboxes)
- [ ] Add bulk delete functionality
- [ ] Create categories system
- [ ] Add archive/unarchive functionality
- [ ] Implement pin/unpin notes

## 🚀 Implementation Order
1. Database schema (Notes model)
2. Basic notes API
3. Dashboard listing
4. Note creation
5. Note editing
6. Dark mode
7. Advanced features (bulk operations, categories)