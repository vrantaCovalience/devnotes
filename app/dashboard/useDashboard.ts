'use client'

import { useEffect, useState } from 'react'

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface Category {
  name: string
  count: number
}

interface DashboardData {
  notes: Note[]
  categories: Category[]
}

interface UseDashboardReturn {
  notes: Note[]
  categories: Category[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  selectedCategory: string
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  refetch: () => void
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData>({ notes: [], categories: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }

      const response = await fetch(`/api/notes?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }

      const result: DashboardData = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [searchTerm, selectedCategory])

  const refetch = () => {
    fetchNotes()
  }

  return {
    notes: data.notes,
    categories: data.categories,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    refetch
  }
}
