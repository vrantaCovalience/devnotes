import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { username: "alice" },
    update: {},
    create: {
      username: "alice",
      password: hashedPassword,
    },
  });

  console.log("Created user:", alice);

  // Create sample notes for testing
  const note1 = await prisma.note.upsert({
    where: { id: "note1" },
    update: {},
    create: {
      id: "note1",
      title: "Welcome to DevNotes",
      content:
        "This is your first note! You can create, edit, and organize your thoughts here.",
      category: "Welcome",
      tags: ["welcome", "first-note", "getting-started"],
      pinned: true,
      userId: alice.id,
    },
  });

  const note2 = await prisma.note.upsert({
    where: { id: "note2" },
    update: {},
    create: {
      id: "note2",
      title: "Project Ideas",
      content: `# Project Ideas for 2025

## Web Development
- [ ] Personal portfolio website
- [ ] E-commerce platform
- [ ] Task management app

## Mobile Development
- [ ] Expense tracker
- [ ] Fitness tracker
- [ ] Social media app

## Learning Goals
- [ ] Master TypeScript
- [ ] Learn React Native
- [ ] Explore AI/ML`,
      category: "Projects",
      tags: ["projects", "ideas", "goals", "2025"],
      pinned: false,
      userId: alice.id,
    },
  });

  const note3 = await prisma.note.upsert({
    where: { id: "note3" },
    update: {},
    create: {
      id: "note3",
      title: "Meeting Notes - Team Standup",
      content: `# Team Standup - September 4, 2025

## Attendees
- Alice
- Bob
- Charlie

## Discussion Points
- Sprint progress review
- Upcoming deadlines
- Resource allocation

## Action Items
- [ ] Complete API documentation
- [ ] Review pull requests
- [ ] Schedule client demo`,
      category: "Work",
      tags: ["meetings", "standup", "team", "work"],
      pinned: false,
      archived: false,
      userId: alice.id,
    },
  });

  const note4 = await prisma.note.upsert({
    where: { id: "note4" },
    update: {},
    create: {
      id: "note4",
      title: "Archived Note Example",
      content:
        "This is an example of an archived note. It won't appear in your main notes list.",
      category: "Archive",
      tags: ["archived", "example"],
      pinned: false,
      archived: true,
      userId: alice.id,
    },
  });

  console.log("Created notes:", { note1, note2, note3, note4 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
