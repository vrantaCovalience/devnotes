import { Card, CardContent } from '@/components/ui/card'

export function LoadingNotes() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading notes...</div>
        </div>
      </CardContent>
    </Card>
  )
}
