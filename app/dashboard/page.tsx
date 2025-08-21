import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}