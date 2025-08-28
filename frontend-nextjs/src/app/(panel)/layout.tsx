'use client'

import React, { useState, useEffect } from 'react'
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
  CloseIcon,
  PlusIcon
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../fonts'
import Input from '@/components/form/input'
import Button from '@/components/button'

interface PanelLayoutProps {
  children: React.ReactNode
}

const PanelLayout = ({ children }: PanelLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon,
      description: 'Overview & Analytics'
    },
    { 
      name: 'Properties', 
      href: '/dashboard/properties', 
      icon: PropertiesIcon,
      description: 'Manage Listings'
    },
    { 
      name: 'Clients', 
      href: '/dashboard/clients', 
      icon: UsersIcon,
      description: 'Customer Management'
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/analytics', 
      icon: AnalyticsIcon,
      description: 'Reports & Insights'
    },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: SettingsIcon,
      description: 'System Configuration'
    },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 via-white to-amber-50/20">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div 
        className={`h-full min-w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-in-out z-50 border-r border-gray-100
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:w-80 lg:shadow-xl`}
      >
        {/* Sidebar Header with Brand */}
        <div className="relative h-[80px] bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 flex items-center px-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-16 h-16 border border-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border border-white rounded-lg rotate-45"></div>
          </div>
          
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white text-lg font-bold">🏠</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold text-white ${MontserratFont.className}`}>
                RealEstate Pro
              </h1>
              <p className={`text-white/80 text-xs ${popinsFont['400'].className}`}>
                Property Management
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8">
          <div className="space-y-3">
            {navigation.map((item, index) => {
              const active = index === 0 ? item.href === pathname : isActive(item.href)
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    group relative flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 hover:scale-105
                    ${active 
                      ? 'bg-gradient-to-r from-[var(--primary)] to-amber-500 text-white shadow-lg shadow-[var(--primary)]/25' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-amber-50 hover:text-gray-900'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                    ${active 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-gray-100 group-hover:bg-[var(--primary)]/10'
                    }
                  `}>
                    <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600 group-hover:text-[var(--primary)]'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-semibold transition-colors duration-200 ${popinsFont['600'].className}`}>
                      {item.name}
                    </div>
                    <div className={`text-xs opacity-70 ${popinsFont['400'].className}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* User Profile Section */}
          <div className="mt-12 p-6 bg-gradient-to-br from-gray-50 to-amber-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-gray-900 ${popinsFont['600'].className}`}>
                  Admin User
                </p>
                <p className={`text-sm text-gray-500 ${popinsFont['400'].className}`}>
                  System Administrator
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-col h-screen overflow-auto w-full">
        {/* Enhanced Header */}
        <header className={`
          sticky top-0 z-30 transition-all duration-300
          ${scrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200' 
            : 'bg-white/50 backdrop-blur-sm'
          }
        `}>
          <div className="px-6 lg:px-8 h-20">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <MenuIcon className="w-5 h-5 text-gray-600 group-hover:text-[var(--primary)]" />
                </button>
                
                {/* Enhanced Search Bar */}
                <div className="hidden sm:block relative">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search properties, clients, documents..."
                      variant="search"
                      icon={<SearchIcon />}
                      className="w-96 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 shadow-sm hover:shadow-md transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded border">⌘K</kbd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications with Badge */}
                <button className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                  <BellIcon className="w-5 h-5 text-gray-600 group-hover:text-[var(--primary)]" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                </button>

                {/* Enhanced Add Property Button */}
                <Button 
                  variant="primary"
                  icon={<PlusIcon className="w-5 h-5" />}
                >
                  Add Property
                </Button>

                {/* User Avatar */}
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    A
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content with enhanced spacing */}
        <main className="flex-1 relative">
          <div className="relative min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PanelLayout