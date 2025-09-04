import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { Suspense } from 'react'
import type { Category } from './actions'
import { updateSearchAndCategory } from './actions'
import { SearchFiltersClient } from './SearchFiltersClient'

interface SearchFiltersProps {
  categories: Category[]
  currentSearch?: string
  currentCategory?: string
}

function SearchFiltersFallback({ categories, currentSearch = '', currentCategory = 'all' }: SearchFiltersProps) {
  return (
    <form action={updateSearchAndCategory} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          name="search"
          placeholder="Search notes by title, content, or tags..."
          defaultValue={currentSearch}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Select name="category" defaultValue={currentCategory}>
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
        <Button type="submit" variant="outline">
          Apply
        </Button>
      </div>
    </form>
  )
}

export function SearchFilters({ categories, currentSearch = '', currentCategory = 'all' }: SearchFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={
          <SearchFiltersFallback 
            categories={categories}
            currentSearch={currentSearch}
            currentCategory={currentCategory}
          />
        }>
          <SearchFiltersClient 
            categories={categories}
            currentSearch={currentSearch}
            currentCategory={currentCategory}
          />
        </Suspense>
      </CardContent>
    </Card>
  )
}
