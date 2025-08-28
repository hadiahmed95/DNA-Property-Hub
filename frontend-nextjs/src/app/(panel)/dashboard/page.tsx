'use client'

import React from 'react'
import Image from 'next/image'
import Card from '@/components/card'
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
  TrashIcon
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../../fonts'
import QuickActions from './_components/quick-actions'

const DashboardPage = () => {
  // Sample data
  const stats = [
    {
      title: 'Total Revenue',
      value: '$2,456,890',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Properties Listed',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: HomeIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Active Agents',
      value: '856',
      change: '+15.3%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Properties Sold',
      value: '342',
      change: '-2.1%',
      changeType: 'decrease',
      icon: AnalyticsIcon,
      color: 'text-orange-600 bg-orange-100'
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
      area: '2,500 sqft'
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
      area: '1,800 sqft'
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
      area: '5,000 sqft'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'property_added',
      title: 'New property added',
      description: 'Modern Villa in Downtown has been listed',
      time: '2 hours ago',
      icon: '🏠'
    },
    {
      id: 2,
      type: 'client_inquiry',
      title: 'New client inquiry',
      description: 'Sarah Johnson inquired about Luxury Apartment',
      time: '4 hours ago',
      icon: '👤'
    },
    {
      id: 3,
      type: 'property_sold',
      title: 'Property sold',
      description: 'Commercial Office Space has been sold',
      time: '1 day ago',
      icon: '💰'
    },
    {
      id: 4,
      type: 'meeting_scheduled',
      title: 'Meeting scheduled',
      description: 'Client meeting with Michael Brown at 3 PM',
      time: '2 days ago',
      icon: '📅'
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Properties' },
    { value: 'for-sale', label: 'For Sale' },
    { value: 'for-rent', label: 'For Rent' },
    { value: 'sold', label: 'Sold' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className={`text-3xl font-bold text-gray-900 ${MontserratFont.className}`}>
            Good morning, John! 👋
          </h1>
          <p className={`text-gray-600 mt-1 ${popinsFont['400'].className}`}>
            Here's what's happening with your properties today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Select
            options={filterOptions}
            defaultValue="all"
            className="w-40"
          />
          <Button variant="primary">
            Add New Property
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-gray-600 ${popinsFont['500'].className}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold text-gray-900 mt-2 ${MontserratFont.className}`}>
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className={`text-sm text-gray-500 ml-1 ${popinsFont['400'].className}`}>
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Properties */}
        <div className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold text-gray-900 ${MontserratFont.className}`}>
                Recent Properties
              </h2>
              <Button variant="secondary" className="text-sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div key={property.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-gray-900 truncate ${popinsFont['500'].className}`}>
                      {property.title}
                    </h3>
                    <p className={`text-sm text-gray-500 ${popinsFont['400'].className}`}>
                      {property.location}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-xs text-gray-500 ${popinsFont['400'].className}`}>
                        {property.bedrooms} bed • {property.bathrooms} bath • {property.area}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`font-bold text-[var(--primary)] ${MontserratFont.className}`}>
                      {property.price}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.status === 'For Sale' 
                        ? 'bg-green-100 text-green-800' 
                        : property.status === 'Sold'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-orange-50 rounded-lg transition-colors duration-200">
                      <EyeIcon />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <EditIcon />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        {/* <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold text-gray-900 ${MontserratFont.className}`}>
                Recent Activities
              </h2>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-gray-900 ${popinsFont['500'].className}`}>
                      {activity.title}
                    </p>
                    <p className={`text-sm text-gray-500 ${popinsFont['400'].className}`}>
                      {activity.description}
                    </p>
                    <p className={`text-xs text-gray-400 mt-1 ${popinsFont['400'].className}`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="secondary" className="w-full mt-6 text-sm">
              View All Activities
            </Button>
          </Card>
        </div> */}
      </div>

      
    {/* Quick Actions */}
    {/* <QuickActions /> */}
    </div>
  )
}

export default DashboardPage