import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevNotes - Simple Note-Taking App',
  description: 'A lightweight CRUD + Auth demo app for GitHub Copilot workshop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}