'use server'

import { verifySession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  name: string
  count: number
}

export interface DashboardData {
  notes: Note[]
  categories: Category[]
}

export async function getDashboardData(
  searchTerm?: string,
  category?: string
): Promise<DashboardData> {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }

  const where: any = {
    userId: session.userId,
  }

  // Apply category filter
  if (category && category !== 'all') {
    where.category = category
  }

  // Apply search filter
  if (searchTerm && searchTerm.trim()) {
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
      { tags: { has: searchTerm } },
    ]
  }

  // Fetch notes
  const notes = await prisma.note.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Get categories with counts for the current user
  const categories = await prisma.note.groupBy({
    by: ['category'],
    where: { userId: session.userId },
    _count: { category: true },
  })

  return {
    notes: notes.map(note => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    })),
    categories: categories.map(c => ({
      name: c.category,
      count: c._count.category,
    })),
  }
}

export async function updateSearchAndCategory(formData: FormData) {
  const searchTerm = formData.get('search') as string
  const category = formData.get('category') as string
  
  const params = new URLSearchParams()
  
  if (searchTerm && searchTerm.trim()) {
    params.append('search', searchTerm.trim())
  }
  
  if (category && category !== 'all') {
    params.append('category', category)
  }
  
  const queryString = params.toString()
  const redirectUrl = queryString ? `/dashboard?${queryString}` : '/dashboard'
  
  redirect(redirectUrl)
}

export async function logoutAction() {
  const { deleteSession } = await import('@/lib/auth')
  await deleteSession()
  redirect('/login')
}
