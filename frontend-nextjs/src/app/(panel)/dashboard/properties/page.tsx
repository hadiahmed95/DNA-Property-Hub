'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'
import Button from '@/components/button'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import propertyService from '@/services/property.service'
import filterService from '@/services/filter.service'
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
  slug?: string
  description?: string
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
  filters?: any[]
}

interface FilterGroup {
  id: number
  name: string
  slug: string
  is_multiple: boolean
}

interface FilterValue {
  id: number
  filter_group_id: number
  value: string
  label: string
  color?: string
  icon?: string
}

const PropertiesPage = () => {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
  const [itemsPerPage] = useState(12)
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter data
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([])
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue[]>>({})
  const [loadingFilters, setLoadingFilters] = useState(true)

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    property_type: '',
    property_status: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    featured: false,
    sortBy: 'newest'
  })

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions()
  }, [])

  // Load properties when page or filters change
  useEffect(() => {
    if (!loadingFilters) {
      loadProperties()
    }
  }, [currentPage, filters, loadingFilters])

  const loadFilterOptions = async () => {
    setLoadingFilters(true)
    try {
      const response = await filterService.getAllFiltersForForm()
      
      if (response.success && response.data) {
        setFilterGroups(response.data.groups || [])
        setFilterValues(response.data.values || {})
      } else {
        console.error('Failed to load filter options:', response.error)
      }
    } catch (error) {
      console.error('Error loading filter options:', error)
    } finally {
      setLoadingFilters(false)
    }
  }

  const loadProperties = async () => {
    setLoading(true)
    try {
      // Build filter parameters
      const filterParams: any = {}
      
      if (filters.search) filterParams.q = filters.search
      if (filters.priceMin) filterParams.min_price = filters.priceMin
      if (filters.priceMax) filterParams.max_price = filters.priceMax
      if (filters.bedrooms) filterParams.bedrooms = filters.bedrooms
      if (filters.bathrooms) filterParams.bathrooms = filters.bathrooms
      if (filters.city) filterParams.city = filters.city
      if (filters.featured) filterParams.featured = 'true'
      if (filters.sortBy) filterParams.sort = filters.sortBy
      
      // Convert filter dropdown values to filter_values IDs
      const filterValueIds: number[] = []
      if (filters.property_type) {
        const typeValue = filterValues['property_type']?.find(v => v.value === filters.property_type)
        if (typeValue) filterValueIds.push(typeValue.id)
      }
      if (filters.property_status) {
        const statusValue = filterValues['property_status']?.find(v => v.value === filters.property_status)
        if (statusValue) filterValueIds.push(statusValue.id)
      }
      if (filterValueIds.length > 0) {
        filterParams.filter_values = filterValueIds.join(',')
      }

      // Call the API with filters
      const response = await propertyService.getMyProperties(currentPage, itemsPerPage, filterParams)
      
      if (response && response.data) {
        setProperties(response.data)
        setFilteredProperties(response.data)
        
        if (response.meta) {
          setTotalPages(response.meta.last_page || 1)
          setTotalProperties(response.meta.total || response.data.length)
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

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
    // Reset to first page when filtering
    if (filterKey !== 'sortBy') {
      setCurrentPage(1)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      property_type: '',
      property_status: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      featured: false,
      sortBy: 'newest'
    })
    setCurrentPage(1)
  }

  const handleViewProperty = (property: Property) => {
    if (property.slug) {
      router.push(`/properties/${property.slug}`)
    } else {
      router.push(`/properties/${property.id}`)
    }
  }

  const handleEditProperty = (property: Property) => {
    router.push(`/dashboard/properties/edit/${property.id}`)
  }

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await propertyService.deleteProperty(propertyId)
      if (response.success) {
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
           '/images/banner-1.jpg' // Fallback image
  }

  // Get filter options for dropdowns - FIXED TO RETURN PROPER ARRAYS
  const getPropertyTypeOptions = () => {
    const propertyTypes = filterValues['property_type'] || []
    return [
      { value: '', label: 'All Types' },
      ...propertyTypes.map(type => ({ value: type.value, label: type.label }))
    ]
  }

  const getPropertyStatusOptions = () => {
    const statuses = filterValues['property_status'] || []
    return [
      { value: '', label: 'All Status' },
      ...statuses.map(status => ({ value: status.value, label: status.label }))
    ]
  }

  const getBedroomOptions = () => {
    return [
      { value: '', label: 'Any Bedrooms' },
      { value: '1', label: '1 Bedroom' },
      { value: '2', label: '2 Bedrooms' },
      { value: '3', label: '3 Bedrooms' },
      { value: '4', label: '4 Bedrooms' },
      { value: '5', label: '5+ Bedrooms' }
    ]
  }

  const getBathroomOptions = () => {
    return [
      { value: '', label: 'Any Bathrooms' },
      { value: '1', label: '1+ Bathroom' },
      { value: '2', label: '2+ Bathrooms' },
      { value: '3', label: '3+ Bathrooms' },
      { value: '4', label: '4+ Bathrooms' }
    ]
  }

  const getSortOptions = () => {
    return [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'bedrooms_asc', label: 'Bedrooms: Low to High' },
      { value: 'bedrooms_desc', label: 'Bedrooms: High to Low' },
      { value: 'sqft_asc', label: 'Size: Small to Large' },
      { value: 'sqft_desc', label: 'Size: Large to Small' }
    ]
  }

  // Property Card Component with improved layout
  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative h-48 w-full">
        <Image
          src={getPropertyImage(property)}
          alt={property.title}
          fill
          className="object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.price?.type === 'sale' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {property.price?.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        {/* Featured Badge */}
        {property.status?.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Property Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className={`font-semibold text-lg text-gray-900 mb-1 line-clamp-2 ${MontserratFont.className}`}>
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {property.location?.full_address || `${property.location?.city}, ${property.location?.state}`}
          </p>
          <p className="text-xl font-bold text-[var(--primary)]">
            {formatPrice(property)}
          </p>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              {property.bedrooms || 0} beds
            </span>
            <span className="flex items-center">
              <span className="w-4 h-4 mr-1">🚿</span>
              {property.bathrooms || 0} baths
            </span>
            <span className="flex items-center">
              <span className="w-4 h-4 mr-1">📐</span>
              {property.square_footage || 0} sqft
            </span>
          </div>
        </div>

        {/* Agent Info */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            Agent: <span className="font-medium">{property.agent?.name}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex space-x-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewProperty(property)}
              className="flex-1"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditProperty(property)}
              className="flex-1"
            >
              <EditIcon className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button
              variant={property.status?.is_featured ? "primary" : "outline"}
              size="sm"
              onClick={() => handleToggleFeatured(property.id)}
            >
              {property.status?.is_featured ? '⭐' : '☆'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteProperty(property.id)}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )

  // Calculate stats from loaded properties
  const featuredCount = properties.filter(p => p.status?.is_featured).length
  const saleCount = properties.filter(p => p.price?.type === 'sale').length
  const rentCount = properties.filter(p => p.price?.type !== 'sale').length

  if (loadingFilters) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        <span className="ml-3">Loading filters...</span>
      </div>
    )
  }

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
            {showFilters ? 'Hide' : 'Show'} Filters
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
            <HomeIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <span className="w-8 h-8 text-purple-600 text-2xl">⭐</span>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{featuredCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <DollarIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">For Sale</p>
              <p className="text-2xl font-bold text-gray-900">{saleCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <HomeIcon className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">For Rent</p>
              <p className="text-2xl font-bold text-gray-900">{rentCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search and Quick Actions */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search properties..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                icon={<SearchIcon className="w-4 h-4" />}
              />
              
              <Select
                options={getPropertyTypeOptions()}
                value={filters.property_type}
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
              />

              <Select
                options={getPropertyStatusOptions()}
                value={filters.property_status}
                onChange={(e) => handleFilterChange('property_status', e.target.value)}
              />

              <Select
                options={getSortOptions()}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Min Price"
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />

              <Input
                placeholder="Max Price"
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />

              <Select
                options={getBedroomOptions()}
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              />

              <Select
                options={getBathroomOptions()}
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              />

              <Input
                placeholder="City"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>

            {/* Third Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm text-gray-700">Featured only</span>
                </label>
              </div>

              {/* Active Filters Count */}
              <div className="text-sm text-gray-600">
                {Object.values(filters).filter(value => 
                  value !== '' && value !== false && value !== 'newest'
                ).length} active filters
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          <span className="ml-3">Loading properties...</span>
        </div>
      )}

      {/* Properties Grid/List */}
      {!loading && (
        <>
          {/* Improved Grid Layout - Wider Cards */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && !loading && (
            <div className="text-center py-12">
              <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                {properties.length === 0 
                  ? "No properties match your search criteria." 
                  : "No properties match your current filters. Try adjusting your search criteria."
                }
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
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
