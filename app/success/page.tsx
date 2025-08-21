import { verifySession } from '@/lib/auth'
import { ArrowRight, CheckCircle, LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SuccessPage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-gray-900">
              Login Successful! 🎉
            </CardTitle>
            <CardDescription className="text-gray-600">
              Welcome back, {session.username}!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                You have successfully logged in to the application.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                asChild
                className="w-full"
                size="lg"
              >
                <a href="/dashboard">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </a>
              </Button>
            
              <form action="/api/auth/logout" method="POST" className="w-full">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}