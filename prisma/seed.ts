import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: {
      username: 'alice',
      password: hashedPassword,
    },
  })

  // Create sample notes for Alice
  const sampleNotes = [
    {
      title: "Welcome to DevNotes",
      content: "This is your first note! You can create, edit, and organize your thoughts here.",
      category: "personal",
      tags: ["welcome", "getting-started"],
      userId: alice.id,
    },
    {
      title: "Project Ideas",
      content: "1. Build a task management app\n2. Create a blog platform\n3. Develop a recipe organizer",
      category: "work",
      tags: ["projects", "ideas", "development"],
      userId: alice.id,
    },
    {
      title: "Shopping List",
      content: "- Milk\n- Bread\n- Eggs\n- Cheese\n- Apples",
      category: "personal",
      tags: ["shopping", "groceries"],
      userId: alice.id,
    },
    {
      title: "Meeting Notes - Q1 Planning",
      content: "Discussed upcoming features:\n- Dark mode implementation\n- Search functionality\n- Mobile optimization\n\nNext steps: Create user stories and timeline",
      category: "work",
      tags: ["meetings", "planning", "q1"],
      userId: alice.id,
    },
    {
      title: "Book Recommendations",
      content: "Technical books to read:\n- Clean Code by Robert Martin\n- The Pragmatic Programmer\n- You Don't Know JS series",
      category: "learning",
      tags: ["books", "reading", "programming"],
      userId: alice.id,
    },
  ]

  // Create the sample notes
  for (const noteData of sampleNotes) {
    await prisma.note.upsert({
      where: {
        id: `note-${noteData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${alice.id}`,
      },
      update: {},
      create: noteData,
    })
  }

  console.log('Created user:', alice)
  console.log('Created sample notes for user')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })