'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Card from '@/components/card'
import Button from '@/components/button'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import { 
  SearchIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  HomeIcon,
  DollarIcon,
  UsersIcon,
  AnalyticsIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../../../fonts'

interface Property {
  id: number
  title: string
  location: string
  price: string
  priceValue: number
  type: string
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Pending'
  bedrooms: number
  bathrooms: number
  area: string
  areaValue: number
  image: string
  featured: boolean
  dateAdded: string
  agent: string
  description: string
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    priceMin: '',
    priceMax: '',
    bedrooms: 'all',
    bathrooms: 'all',
    location: 'all',
    featured: false,
    sortBy: 'newest'
  })

  // Sample data - in real app, this would come from an API
  const sampleProperties: Property[] = [
    {
      id: 1,
      title: 'Modern Villa in Downtown',
      location: 'Miami, FL',
      price: '$850,000',
      priceValue: 850000,
      type: 'Villa',
      status: 'For Sale',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,500 sqft',
      areaValue: 2500,
      image: '/images/banner-1.jpg',
      featured: true,
      dateAdded: '2024-01-15',
      agent: 'John Smith',
      description: 'Beautiful modern villa with stunning city views and premium finishes throughout.'
    },
    {
      id: 2,
      title: 'Luxury Apartment Complex',
      location: 'New York, NY',
      price: '$1,200,000',
      priceValue: 1200000,
      type: 'Apartment',
      status: 'Sold',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,800 sqft',
      areaValue: 1800,
      image: '/images/banner-2.jpg',
      featured: false,
      dateAdded: '2024-01-10',
      agent: 'Sarah Johnson',
      description: 'Luxury apartment in prime location with world-class amenities.'
    },
    {
      id: 3,
      title: 'Commercial Office Space',
      location: 'Los Angeles, CA',
      price: '$2,100/month',
      priceValue: 2100,
      type: 'Commercial',
      status: 'For Rent',
      bedrooms: 0,
      bathrooms: 4,
      area: '5,000 sqft',
      areaValue: 5000,
      image: '/images/banner-1.jpg',
      featured: true,
      dateAdded: '2024-01-08',
      agent: 'Mike Davis',
      description: 'Prime commercial space in business district with parking facilities.'
    },
    {
      id: 4,
      title: 'Cozy Family Home',
      location: 'Austin, TX',
      price: '$450,000',
      priceValue: 450000,
      type: 'House',
      status: 'For Sale',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,950 sqft',
      areaValue: 1950,
      image: '/images/banner-2.jpg',
      featured: false,
      dateAdded: '2024-01-05',
      agent: 'Emily Wilson',
      description: 'Perfect family home with large backyard and excellent school district.'
    },
    {
      id: 5,
      title: 'Penthouse Suite',
      location: 'San Francisco, CA',
      price: '$3,500,000',
      priceValue: 3500000,
      type: 'Penthouse',
      status: 'Pending',
      bedrooms: 4,
      bathrooms: 4,
      area: '3,200 sqft',
      areaValue: 3200,
      image: '/images/banner-1.jpg',
      featured: true,
      dateAdded: '2024-01-12',
      agent: 'Robert Chen',
      description: 'Exclusive penthouse with panoramic city views and luxury amenities.'
    },
    {
      id: 6,
      title: 'Charming Townhouse',
      location: 'Boston, MA',
      price: '$675,000',
      priceValue: 675000,
      type: 'Townhouse',
      status: 'For Sale',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,400 sqft',
      areaValue: 1400,
      image: '/images/banner-2.jpg',
      featured: false,
      dateAdded: '2024-01-03',
      agent: 'Lisa Martinez',
      description: 'Historic townhouse with modern updates in desirable neighborhood.'
    }
  ]

  // Initialize data
  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      // Generate more sample data
      const expandedProperties = []
      for (let i = 0; i < 5; i++) {
        expandedProperties.push(...sampleProperties.map(prop => ({
          ...prop,
          id: prop.id + (i * 6),
          title: `${prop.title} ${i > 0 ? `(${i + 1})` : ''}`,
          dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })))
      }
      setProperties(expandedProperties)
      setFilteredProperties(expandedProperties)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and sort properties
  useEffect(() => {
    let filtered = [...properties]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.agent.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(property => property.status === filters.status)
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(property => property.type === filters.type)
    }

    // Price range filter
    if (filters.priceMin) {
      filtered = filtered.filter(property => property.priceValue >= parseInt(filters.priceMin))
    }
    if (filters.priceMax) {
      filtered = filtered.filter(property => property.priceValue <= parseInt(filters.priceMax))
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'all') {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms))
    }

    // Bathrooms filter
    if (filters.bathrooms !== 'all') {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms))
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(property => property.featured)
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceValue - b.priceValue)
        break
      case 'price-high':
        filtered.sort((a, b) => b.priceValue - a.priceValue)
        break
      case 'area-large':
        filtered.sort((a, b) => b.areaValue - a.areaValue)
        break
      case 'area-small':
        filtered.sort((a, b) => a.areaValue - b.areaValue)
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    }

    setFilteredProperties(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [properties, filters])

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'For Sale', label: 'For Sale' },
    { value: 'For Rent', label: 'For Rent' },
    { value: 'Sold', label: 'Sold' },
    { value: 'Pending', label: 'Pending' }
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Commercial', label: 'Commercial' }
  ]

  const bedroomOptions = [
    { value: 'all', label: 'Any Bedrooms' },
    { value: '1', label: '1+ Bedrooms' },
    { value: '2', label: '2+ Bedrooms' },
    { value: '3', label: '3+ Bedrooms' },
    { value: '4', label: '4+ Bedrooms' }
  ]

  const bathroomOptions = [
    { value: 'all', label: 'Any Bathrooms' },
    { value: '1', label: '1+ Bathrooms' },
    { value: '2', label: '2+ Bathrooms' },
    { value: '3', label: '3+ Bathrooms' },
    { value: '4', label: '4+ Bathrooms' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'area-large', label: 'Area: Large to Small' },
    { value: 'area-small', label: 'Area: Small to Large' }
  ]

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProperties = filteredProperties.slice(startIndex, endIndex)

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      priceMin: '',
      priceMax: '',
      bedrooms: 'all',
      bathrooms: 'all',
      location: 'all',
      featured: false,
      sortBy: 'newest'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'For Rent':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Sold':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 rounded-3xl mx-6 mt-6 mb-8 p-8 lg:p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white mb-6 lg:mb-0">
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${MontserratFont.className}`}>
              Properties
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              Manage and browse your property portfolio. Use advanced filters to find exactly what you're looking for.
            </p>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <HomeIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>{filteredProperties.length} Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>Multi-Status</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="dark" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 border min-w-max"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white hover:bg-gray-50 text-[var(--primary)] border-0 min-w-max"
              icon={<PlusIcon className="w-4 h-4" />}
            >
              Add Property
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mx-6 mb-8" variant="elevated">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold text-gray-900 ${MontserratFont.className}`}>
                Advanced Filters
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            </div>

            {/* Search Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Input
                  type="search"
                  placeholder="Search by title, location, or agent..."
                  icon={<SearchIcon />}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                options={sortOptions}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                placeholder="Sort by..."
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Select
                options={statusOptions}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                placeholder="Status"
              />
              
              <Select
                options={typeOptions}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                placeholder="Type"
              />
              
              <Select
                options={bedroomOptions}
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                placeholder="Bedrooms"
              />
              
              <Select
                options={bathroomOptions}
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                placeholder="Bathrooms"
              />
              
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />
              
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20"
                />
                <span className={`text-gray-700 ${popinsFont['500'].className}`}>Featured Only</span>
              </label>

              <div className="flex items-center space-x-4">
                <span className={`text-gray-700 ${popinsFont['500'].className}`}>View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Header */}
      <div className="mx-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <p className={`text-gray-600 ${popinsFont['500'].className}`}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
            </p>
          </div>
          {loading && (
            <div className="flex items-center space-x-2 text-[var(--primary)]">
              <div className="animate-spin w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full"></div>
              <span className={`${popinsFont['500'].className}`}>Loading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid/List */}
      <div className="mx-6 mb-8">
        {currentProperties.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {currentProperties.map((property) => (
              <Card 
                key={property.id} 
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                variant="elevated"
                padding={viewMode === 'list' ? 'lg' : 'md'}
              >
                {property.featured && (
                  <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-[var(--primary)] to-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                    Featured
                  </div>
                )}

                <div className={`${viewMode === 'list' ? 'flex items-center space-x-6' : ''}`}>
                  {/* Property Image */}
                  <div className={`relative overflow-hidden rounded-2xl ${
                    viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48 mb-4'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-amber-500 flex items-center justify-center text-white text-4xl">
                      🏠
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className={`absolute ${viewMode === 'list' ? 'top-3 left-3' : 'bottom-3 left-3'}`}>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex items-start justify-between' : 'mb-4'}`}>
                      <div className={`${viewMode === 'list' ? 'flex-1 pr-6' : ''}`}>
                        <h3 className={`text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors duration-200 ${MontserratFont.className}`}>
                          {property.title}
                        </h3>
                        <p className={`text-gray-600 mb-3 ${popinsFont['500'].className} flex items-center`}>
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {property.location}
                        </p>

                        {/* Property Features */}
                        <div className={`flex items-center space-x-4 text-sm text-gray-600 ${viewMode === 'list' ? 'mb-2' : 'mb-4'}`}>
                          {property.bedrooms > 0 && (
                            <span className="flex items-center">
                              🛏️ {property.bedrooms} beds
                            </span>
                          )}
                          <span className="flex items-center">
                            🚿 {property.bathrooms} baths
                          </span>
                          <span className="flex items-center">
                            📐 {property.area}
                          </span>
                        </div>

                        {viewMode === 'list' && (
                          <p className={`text-gray-600 text-sm mb-3 ${popinsFont['400'].className}`}>
                            {property.description}
                          </p>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className={`${viewMode === 'list' ? 'text-right flex-shrink-0' : ''}`}>
                        <p className={`text-2xl font-bold text-[var(--primary)] mb-4 ${MontserratFont.className}`}>
                          {property.price}
                        </p>

                        {/* Action Buttons */}
                        <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'justify-end' : 'justify-center'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
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

                    {/* Agent Info */}
                    <div className={`flex items-center justify-between pt-3 border-t border-gray-100 ${viewMode === 'list' ? 'mt-3' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {property.agent.charAt(0)}
                        </div>
                        <span className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                          {property.agent}
                        </span>
                      </div>
                      <span className={`text-xs text-gray-500 ${popinsFont['400'].className}`}>
                        {new Date(property.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16" variant="glass">
            <div className="text-6xl mb-6">🏠</div>
            <h3 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
              No Properties Found
            </h3>
            <p className={`text-gray-600 mb-8 ${popinsFont['400'].className}`}>
              Try adjusting your filters or search criteria to find more properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
              <Button variant="ghost">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add New Property
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="mx-6 mb-8">
          <Card className="px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                Page {currentPage} of {totalPages} ({filteredProperties.length} total results)
              </div>

              <div className="flex items-center space-x-2">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  First
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ←
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    let pageNumber;
                    
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-[var(--primary)] text-white shadow-lg'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  →
                </button>

                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Last
                </button>
              </div>

              {/* Items Per Page Selector */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>Show:</span>
                <select 
                  value={itemsPerPage} 
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                  onChange={(e) => {
                    // In a real app, you'd update the itemsPerPage state
                    console.log('Items per page:', e.target.value)
                  }}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="mx-6 mb-8">
        <Card variant="gradient" className="bg-gradient-to-r from-[var(--primary)]/10 via-amber-50 to-orange-50/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                🏠
              </div>
              <div className={`text-2xl font-bold text-emerald-600 ${MontserratFont.className}`}>
                {properties.filter(p => p.status === 'For Sale').length}
              </div>
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                For Sale
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                🏢
              </div>
              <div className={`text-2xl font-bold text-blue-600 ${MontserratFont.className}`}>
                {properties.filter(p => p.status === 'For Rent').length}
              </div>
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                For Rent
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                ✅
              </div>
              <div className={`text-2xl font-bold text-gray-600 ${MontserratFont.className}`}>
                {properties.filter(p => p.status === 'Sold').length}
              </div>
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                Sold
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                ⏳
              </div>
              <div className={`text-2xl font-bold text-amber-600 ${MontserratFont.className}`}>
                {properties.filter(p => p.status === 'Pending').length}
              </div>
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                Pending
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <button className="w-14 h-14 bg-gradient-to-r from-[var(--primary)] to-amber-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default PropertiesPage