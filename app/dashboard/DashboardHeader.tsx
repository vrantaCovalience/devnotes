'use client'

import { Button } from '@/components/ui/button'
import { LogOut, Plus } from 'lucide-react'
import { logoutAction } from './actions'

interface DashboardHeaderProps {
  username: string
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {username}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
