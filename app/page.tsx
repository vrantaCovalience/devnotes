import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await verifySession()
  
  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}