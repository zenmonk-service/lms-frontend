import AppBar from '@/components/app-bar'
import React from 'react'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
  <div className="max-h-screen flex flex-col">
      <AppBar />
      <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
      </div>
    </div>
  )
}
