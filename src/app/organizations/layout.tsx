import AppBar from '@/components/app-bar'
import React from 'react'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
  <div className="h-max-screen flex flex-col">
      <AppBar />
      <div className="flex flex-1 overflow-hidden h-max-[calc(100vh-69px)]">
          <main className="flex-1 overflow-hidden h-max-[calc(100vh-69px)]">
            {children}
          </main>
      </div>
    </div>
  )
}
