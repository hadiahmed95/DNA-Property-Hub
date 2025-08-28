'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  PropertiesIcon, 
  UsersIcon, 
  AnalyticsIcon, 
  SettingsIcon,
  SearchIcon,
  BellIcon,
  MenuIcon,
  CloseIcon
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../fonts'
import Input from '@/components/form/input'
import Button from '@/components/button'

interface PanelLayoutProps {
  children: React.ReactNode
}

const PanelLayout = ({ children }: PanelLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Properties', href: '/dashboard/properties', icon: PropertiesIcon },
    { name: 'Clients', href: '/dashboard/clients', icon: UsersIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: AnalyticsIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        min-w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-[80px] border-b border-gray-200">
            <div className="flex items-center space-x-3 mx-auto">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <span className={`text-white font-bold text-sm ${MontserratFont.className}`}>DNA</span>
              </div>
              <span className={`text-xl font-bold text-gray-800 ${MontserratFont.className}`}>
                Properties Hub
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-[var(--primary)] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--primary)]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className={`font-medium ${popinsFont['500'].className}`}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center">
                <span className={`text-white font-medium ${popinsFont['500'].className}`}>JD</span>
              </div>
              <div>
                <p className={`text-sm font-medium text-gray-800 ${popinsFont['500'].className}`}>
                  John Doe
                </p>
                <p className={`text-xs text-gray-500 ${popinsFont['400'].className}`}>
                  Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col h-screen overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-[79px] flex items-center">
            <div className="flex items-center justify-between h-16 w-full">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <MenuIcon className="w-5 h-5" />
                </button>
                
                {/* Search */}
                <div className="hidden sm:block">
                  <Input
                    type="search"
                    placeholder="Search properties, clients..."
                    variant="search"
                    icon={<SearchIcon />}
                    className="w-80"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <BellIcon className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">3</span>
                  </span>
                </button>

                {/* Add Property Button */}
                <Button variant="primary" className="hidden sm:flex">
                  Add Property
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default PanelLayout