'use client'

import React from 'react'
import Button from '@/components/button'
import Select from '@/components/form/select'
import {
  DollarIcon,
  HomeIcon,
  UsersIcon,
  AnalyticsIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PlusIcon
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../../fonts'

const DashboardPage = () => {
  // Sample data with enhanced metrics
  const stats = [
    {
      title: 'Total Revenue',
      value: '$2,456,890',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarIcon,
      color: 'text-emerald-600 bg-emerald-50',
      subtitle: 'vs last month'
    },
    {
      title: 'Properties Listed',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: HomeIcon,
      color: 'text-blue-600 bg-blue-50',
      subtitle: 'active listings'
    },
    {
      title: 'Active Agents',
      value: '856',
      change: '+15.3%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'text-purple-600 bg-purple-50',
      subtitle: 'team members'
    },
    {
      title: 'Properties Sold',
      value: '342',
      change: '-2.1%',
      changeType: 'decrease',
      icon: AnalyticsIcon,
      color: 'text-[var(--primary)] bg-amber-50',
      subtitle: 'this quarter'
    }
  ]

  const recentProperties = [
    {
      id: 1,
      title: 'Modern Villa in Downtown',
      location: 'Miami, FL',
      price: '$850,000',
      type: 'Villa',
      status: 'For Sale',
      image: '/images/banner-1.jpg',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,500 sqft',
      featured: true
    },
    {
      id: 2,
      title: 'Luxury Apartment Complex',
      location: 'New York, NY',
      price: '$1,200,000',
      type: 'Apartment',
      status: 'Sold',
      image: '/images/banner-2.jpg',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,800 sqft',
      featured: false
    },
    {
      id: 3,
      title: 'Commercial Office Space',
      location: 'Los Angeles, CA',
      price: '$2,100,000',
      type: 'Commercial',
      status: 'For Rent',
      image: '/images/banner-1.jpg',
      bedrooms: 0,
      bathrooms: 4,
      area: '5,000 sqft',
      featured: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 rounded-3xl mx-6 mt-6 mb-8 p-8 lg:p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white mb-6 lg:mb-0">
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${MontserratFont.className}`}>
              Welcome back!
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              Here's what's happening with your real estate portfolio today. Monitor performance, track listings, and manage your team all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="dark"
                icon={<PlusIcon className="w-5 h-5" />}
              // className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 border"
              >
                Add New Property
              </Button>
              <Button
                variant="secondary"
                className="bg-white hover:bg-gray-50 text-[var(--primary)] border-0"
              >
                View Analytics
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex items-center justify-center border border-white/20">
              <div className="text-6xl lg:text-7xl">🏠</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[var(--primary)]/20 hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-sm font-semibold ${stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>

              <div>
                <h3 className={`text-2xl lg:text-3xl font-bold text-gray-900 mb-1 ${MontserratFont.className}`}>
                  {stat.value}
                </h3>
                <p className={`text-gray-600 text-sm ${popinsFont['500'].className}`}>
                  {stat.title}
                </p>
                <p className={`text-gray-500 text-xs mt-1 ${popinsFont['400'].className}`}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-6 pb-12">

        {/* Recent Properties - Enhanced Card */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-gray-900 via-[var(--secondary)] to-gray-800 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-bold text-white mb-2 ${MontserratFont.className}`}>
                    Recent Properties
                  </h2>
                  <p className={`text-gray-300 ${popinsFont['400'].className}`}>
                    Latest property listings and updates
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 border"
                >
                  View All
                </Button>
              </div>
            </div>

            {/* Properties List */}
            <div className="p-8">
              <div className="space-y-6">
                {recentProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="group relative bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {property.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--primary)] to-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Featured
                      </div>
                    )}

                    <div className="flex items-start space-x-6">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                          🏠
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className={`text-lg font-bold text-gray-900 mb-1 group-hover:text-[var(--primary)] transition-colors duration-200 ${MontserratFont.className}`}>
                              {property.title}
                            </h3>
                            <p className={`text-gray-600 ${popinsFont['500'].className}`}>
                              {property.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold text-[var(--primary)] ${MontserratFont.className}`}>
                              {property.price}
                            </p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${property.status === 'For Sale'
                                ? 'bg-emerald-100 text-emerald-800'
                                : property.status === 'Sold'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                              {property.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span className={`${popinsFont['500'].className}`}>
                              🛏️ {property.bedrooms} beds
                            </span>
                            <span className={`${popinsFont['500'].className}`}>
                              🚿 {property.bathrooms} baths
                            </span>
                            <span className={`${popinsFont['500'].className}`}>
                              📐 {property.area}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-amber-50 rounded-xl transition-all duration-200 hover:scale-110">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110">
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Property CTA */}
              <div className="mt-8 p-6 bg-gradient-to-r from-[var(--primary)]/10 to-amber-100/50 rounded-2xl border-2 border-dashed border-[var(--primary)]/30 hover:border-[var(--primary)]/50 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-center text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                      <PlusIcon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${MontserratFont.className}`}>
                      Add New Property
                    </h3>
                    <p className={`text-gray-600 text-sm ${popinsFont['400'].className}`}>
                      List a new property to expand your portfolio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Stats & Actions */}
        <div className="space-y-8">
          {/* Performance Overview */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--secondary)] to-gray-800 p-6">
              <h2 className={`text-xl font-bold text-white mb-2 ${MontserratFont.className}`}>
                Performance Overview
              </h2>
              <p className={`text-gray-300 text-sm ${popinsFont['400'].className}`}>
                Your portfolio metrics at a glance
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Chart Placeholder with Animation */}
              <div className="relative h-40 bg-gradient-to-br from-[var(--primary)]/10 to-amber-100/50 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 to-transparent animate-pulse"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white text-2xl mb-3 mx-auto animate-bounce">
                    📊
                  </div>
                  <p className={`text-gray-600 font-medium ${popinsFont['500'].className}`}>
                    Chart Integration Coming Soon
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">94%</div>
                  <div className="text-xs text-emerald-700 font-medium">Occupancy Rate</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600 mb-1">28</div>
                  <div className="text-xs text-blue-700 font-medium">Days Avg. Sale</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}

          {/* Recent Activity Feed */}

        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-6 mx-6 mb-6 z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white">
                  <span className="text-sm">📈</span>
                </div>
                <div>
                  <p className={`text-sm font-semibold text-gray-900 ${popinsFont['600'].className}`}>
                    Portfolio Growing
                  </p>
                  <p className={`text-xs text-gray-600 ${popinsFont['400'].className}`}>
                    +12% this month
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="secondary">
                Export Data
              </Button>
              <Button variant="primary">
                Add Property
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage