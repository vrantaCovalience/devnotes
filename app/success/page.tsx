import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SuccessPage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login Successful! 🎉
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back, {session.username}!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700">
                You have successfully logged in to the application.
              </p>
            </div>
            
            <div className="text-center">
              <a 
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-3"
              >
                Go to Dashboard
              </a>
            </div>
            
            <div className="text-center">
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}