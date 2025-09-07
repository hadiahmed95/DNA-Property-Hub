'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Card from '@/components/card'
import Button from '@/components/button'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import propertyService from '@/services/property.service'
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
  location: {
    address: string
    city: string
    state: string
    full_address: string
  }
  price: {
    value: number
    formatted: string
    type: string
  }
  bedrooms: number
  bathrooms: number
  square_footage: number
  media: {
    images: string[]
    primary_image?: string
  }
  status: {
    is_active: boolean
    is_featured: boolean
  }
  agent: {
    name: string
  }
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
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

  // Load properties on component mount and when filters change
  useEffect(() => {
    loadProperties()
  }, [currentPage, filters])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const apiFilters: any = {
        page: currentPage,
        per_page: itemsPerPage,
        sort: filters.sortBy
      }

      // Add filters if they have values
      if (filters.priceMin) apiFilters.min_price = parseFloat(filters.priceMin)
      if (filters.priceMax) apiFilters.max_price = parseFloat(filters.priceMax)
      if (filters.bedrooms !== 'all') apiFilters.bedrooms = parseInt(filters.bedrooms)
      if (filters.bathrooms !== 'all') apiFilters.bathrooms = parseFloat(filters.bathrooms)
      if (filters.featured) apiFilters.featured = true

      const response = await propertyService.getProperties(apiFilters)
      
      if (response.success && response.data) {
        const propertiesData = Array.isArray(response.data) ? response.data : response.data.data
        setProperties(propertiesData || [])
        setFilteredProperties(propertiesData || [])
        
        // Handle pagination metadata if available
        if (response.data.meta) {
          setTotalPages(response.data.meta.last_page || 1)
          setTotalProperties(response.data.meta.total || propertiesData.length)
        } else {
          setTotalProperties(propertiesData.length)
        }
      }
    } catch (error) {
      console.error('Failed to load properties:', error)
      setProperties([])
      setFilteredProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      setLoading(true)
      try {
        const response = await propertyService.searchProperties(searchQuery, {
          page: 1,
          per_page: itemsPerPage
        })
        
        if (response.success && response.data) {
          const propertiesData = Array.isArray(response.data) ? response.data : response.data.data
          setFilteredProperties(propertiesData || [])
          setCurrentPage(1)
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    } else {
      // Reset to show all properties
      setFilteredProperties(properties)
    }
  }

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await propertyService.deleteProperty(propertyId)
      if (response.success) {
        // Reload properties after deletion
        loadProperties()
      } else {
        alert('Failed to delete property: ' + (response.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete property')
    }
  }

  const handleToggleFeatured = async (propertyId: number) => {
    try {
      const response = await propertyService.toggleFeatured(propertyId)
      if (response.success) {
        // Reload properties after toggle
        loadProperties()
      }
    } catch (error) {
      console.error('Toggle featured failed:', error)
      alert('Failed to toggle featured status')
    }
  }

  const formatPrice = (property: Property) => {
    if (property.price?.formatted) {
      return property.price.formatted
    }
    if (property.price?.value) {
      return `$${property.price.value.toLocaleString()}`
    }
    return 'Price not available'
  }

  const getPropertyImage = (property: Property) => {
    return property.media?.primary_image || 
           property.media?.images?.[0] || 
           '/images/banner-1.jpg' // fallback image
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={getPropertyImage(property)}
          alt={property.title}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to default image on error
            e.currentTarget.src = '/images/banner-1.jpg'
          }}
        />
        {property.status?.is_featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          {property.price?.type === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-bold text-lg text-gray-900 mb-2 line-clamp-2 ${MontserratFont.className}`}>
          {property.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.location?.full_address || `${property.location?.city}, ${property.location?.state}`}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-[var(--primary)]">
            {formatPrice(property)}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              {property.bedrooms} beds
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">🚿</span>
              {property.bathrooms} baths
            </div>
          )}
          {property.square_footage > 0 && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">📐</span>
              {property.square_footage?.toLocaleString()} sqft
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteProperty(property.id)}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant={property.status?.is_featured ? "primary" : "outline"}
            size="sm"
            onClick={() => handleToggleFeatured(property.id)}
          >
            {property.status?.is_featured ? 'Featured' : 'Feature'}
          </Button>
        </div>
      </div>
    </Card>
  )

  // Calculate stats from loaded properties
  const featuredCount = properties.filter(p => p.status?.is_featured).length
  const saleCount = properties.filter(p => p.price?.type === 'sale').length
  const rentCount = properties.filter(p => p.price?.type !== 'sale').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-3xl font-bold text-gray-900 ${MontserratFont.className}`}>
            Properties
          </h1>
          <p className={`text-gray-600 mt-1 ${popinsFont['400'].className}`}>
            Manage your property listings ({totalProperties} total)
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button href="/dashboard/properties/add">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <HomeIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
              <p className="text-gray-600 text-sm">Total Properties</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <DollarIcon className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{featuredCount}</p>
              <p className="text-gray-600 text-sm">Featured</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{saleCount}</p>
              <p className="text-gray-600 text-sm">For Sale</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <AnalyticsIcon className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{rentCount}</p>
              <p className="text-gray-600 text-sm">For Rent</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search properties..."
              value={filters.search}
              onChange={(e) => {
                handleFilterChange('search', e.target.value)
                handleSearch(e.target.value)
              }}
            />
            
            <Select
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' }
              ]}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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
        </Card>
      )}

      {/* Properties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && !loading && (
            <div className="text-center py-12">
              <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or add a new property.</p>
              <Button href="/dashboard/properties/add">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PropertiesPage
