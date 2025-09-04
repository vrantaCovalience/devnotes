'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import type { Category } from './actions'

interface SearchFiltersClientProps {
  categories: Category[]
  currentSearch?: string
  currentCategory?: string
}

// Custom debounce hook
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>()

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      setDebounceTimer(setTimeout(() => callback(...args), delay))
    },
    [callback, delay, debounceTimer]
  )

  return debouncedCallback
}

export function SearchFiltersClient({ categories, currentSearch = '', currentCategory = 'all' }: SearchFiltersClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [categoryValue, setCategoryValue] = useState(currentCategory)

  const updateUrl = useCallback((search: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (search && search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    
    if (category && category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    
    const queryString = params.toString()
    const newUrl = queryString ? `/dashboard?${queryString}` : '/dashboard'
    
    startTransition(() => {
      router.replace(newUrl as any)
    })
  }, [searchParams, router])

  const debouncedSearch = useDebounce((search: string) => {
    updateUrl(search, categoryValue)
  }, 300)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    debouncedSearch(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value)
    updateUrl(searchValue, value)
  }

  // Sync with server state when URL changes
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    setSearchValue(search)
    setCategoryValue(category)
  }, [searchParams])

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search notes by title, content, or tags..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          disabled={isPending}
        />
      </div>
      <div className="flex gap-2">
        <Select value={categoryValue} onValueChange={handleCategoryChange} disabled={isPending}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isPending && (
          <Button variant="outline" disabled>
            Searching...
          </Button>
        )}
      </div>
    </div>
  )
}
