# GitHub Copilot Workshop - Authentication Boilerplate

This repository contains a **minimal authentication system** built as part of a **GitHub Copilot workshop**. The goal is to demonstrate how GitHub Copilot can accelerate development by helping build a complete full-stack authentication flow with modern technologies.

## 🎯 Workshop Objectives

In this workshop, we're building a **lightweight authentication boilerplate** that showcases:

1. **Modern Full-Stack Development** - Next.js 15 with App Router and TypeScript
2. **Database Integration** - PostgreSQL with Prisma ORM
3. **Authentication Flow** - JWT-based session management
4. **Developer Experience** - Docker for local development, automated database setup
5. **AI-Assisted Coding** - Using GitHub Copilot to accelerate development

This serves as a **foundation** that can be extended into larger applications like note-taking apps, task managers, or any application requiring user authentication.

## �️ Prerequisites

Before starting this workshop, ensure you have the following installed on your machine:

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended with GitHub Copilot extension

### Required Accounts
- **GitHub Account** with Copilot access
- **Docker Hub Account** (optional, for pulling images)

### Verify Prerequisites
Run these commands to verify your setup:
```bash
node --version    # Should show v18+
npm --version     # Should show npm version
docker --version  # Should show Docker version
git --version     # Should show Git version
```

## 🚀 Quick Setup Guide

Follow these steps to get the application running:

### 1. Clone and Navigate
```bash
git clone <repository-url>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Database
```bash
npm run docker:up
```
*This starts a PostgreSQL container with the required database*

### 4. Set up Environment Variables
The `.env` and `.env.local` files are already configured. No changes needed unless you want to customize:
```bash
DATABASE_URL="postgresql://devnotes:devnotes@localhost:5432/devnotes"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 5. Initialize Database
```bash
npm run db:push    # Creates database tables
npm run db:seed    # Creates test user data
```

### 6. Start Development Server
```bash
npm run dev
```

The application will start on `http://localhost:3000` (or next available port).

## 🧪 Testing the Application

### Test the Complete Flow

1. **Visit the Application**
   - Open `http://localhost:3000` in your browser
   - Should automatically redirect to `/login`

2. **Test Login Functionality**
   - Use the pre-created test credentials:
     - **Username:** `alice`
     - **Password:** `password123`
   - Click "Sign In"

3. **Verify Authentication**
   - Should redirect to `/success` page showing "Login Successful! 🎉"
   - Should display "Welcome back, alice!"

4. **Test Dashboard Access**
   - Click "Go to Dashboard" button
   - Should navigate to `/dashboard` showing "Dashboard" heading
   - This confirms protected route is working

5. **Test Logout**
   - Click "Logout" button from success page
   - Should redirect back to login page
   - Try accessing `/dashboard` directly - should redirect to login

### Verify Database Connection
```bash
# Check if Docker container is running
docker ps

# Should show a container named "devnotes-db-1" with postgres:15 image
```

### Check Logs for Errors
```bash
# In your terminal where npm run dev is running
# Look for any error messages or warnings
```

## 📁 Project Structure

```
devnotes/
├── app/                          # Next.js App Router pages
│   ├── api/auth/                 # Authentication API endpoints
│   │   ├── login/route.ts        # POST /api/auth/login
│   │   └── logout/route.ts       # POST /api/auth/logout
│   ├── dashboard/page.tsx        # Protected dashboard page
│   ├── login/                    # Login page
│   │   ├── page.tsx              # Login page component
│   │   └── login-form.tsx        # Login form component
│   ├── success/page.tsx          # Success page after login
│   ├── layout.tsx                # Root layout with global styles
│   └── page.tsx                  # Home page (redirects logic)
├── lib/                          # Utility libraries
│   ├── auth.ts                   # JWT session management
│   └── db.ts                     # Prisma database connection
├── prisma/                       # Database configuration
│   ├── schema.prisma             # Database schema (User model)
│   └── seed.ts                   # Database seeding script
├── .env                          # Environment variables (for Prisma)
├── .env.local                    # Environment variables (for Next.js)
├── docker-compose.yml            # PostgreSQL container setup
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🔧 Available Commands

```bash
# Development
npm run dev                       # Start development server

# Database Management
npm run docker:up                 # Start PostgreSQL container
npm run docker:down               # Stop PostgreSQL container
npm run db:push                   # Apply schema changes to database
npm run db:seed                   # Seed database with test data

# Production
npm run build                     # Build for production
npm run start                     # Start production server
```

## 🧰 Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 15.1.4 |
| **TypeScript** | Type safety and better DX | 5+ |
| **PostgreSQL** | Primary database | 15 |
| **Prisma** | Database ORM and migrations | 6.2.1+ |
| **Tailwind CSS** | Utility-first CSS framework | 4+ |
| **Docker** | Database containerization | Latest |
| **jose** | JWT library for authentication | 5.2.0+ |
| **bcryptjs** | Password hashing | 2.4.3+ |

## 🚦 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Ensure Docker is running
docker ps

# Restart the database container
npm run docker:down
npm run docker:up
```

**Port 3000 Already in Use**
- Next.js will automatically try port 3001
- Or manually specify: `npm run dev -- -p 3002`

**Environment Variables Not Loading**
- Ensure both `.env` and `.env.local` files exist
- Restart the development server after changes

**Database Schema Issues**
```bash
# Reset database and reapply schema
npm run docker:down
npm run docker:up
npm run db:push
npm run db:seed
```

## 🎓 Workshop Learning Outcomes

After completing this workshop, you'll understand:

1. **Modern React Development** with Next.js App Router
2. **Database Integration** using Prisma ORM
3. **Authentication Implementation** with JWT sessions
4. **Docker for Development** environments
5. **TypeScript** for type-safe development
6. **API Route** creation and authentication middleware
7. **GitHub Copilot** integration for faster development

## 🔗 Next Steps

This boilerplate can be extended with:
- User registration functionality
- Password reset features
- Role-based access control
- Note-taking CRUD operations
- Real-time features with WebSockets
- Deployment to Vercel/Railway

---

**Happy Coding with GitHub Copilot! 🚀**