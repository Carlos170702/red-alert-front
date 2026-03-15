import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'

export function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <Sidebar isOpen={isSidebarOpen} />
      <main
        className={`min-h-screen overflow-auto pt-14 transition-[margin] duration-200 ${isSidebarOpen ? 'pl-56' : 'pl-16'}`}
      >
        <Outlet />
      </main>
    </div>
  )
}
