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
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../../../fonts'

interface Property {
  id: number
  title: string
  slug?: string
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
}

interface FilterValue {
  id: number
  value: string
  label: string
}

const PropertiesPage = () => {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
  const [itemsPerPage] = useState(12)
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter data from API
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([])
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue[]>>({})
  const [loadingFilters, setLoadingFilters] = useState(true)

  // Filter states
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

  // Load filters on mount
  useEffect(() => {
    loadFilterOptions()
  }, [])

  // Load properties when filters change
  useEffect(() => {
    if (!loadingFilters) {
      loadProperties()
    }
  }, [filters, currentPage, loadingFilters])

  const loadFilterOptions = async () => {
    setLoadingFilters(true)
    try {
      const response: any = await filterService.getAllFiltersForForm()
      if (response && response.success && response.data) {
        setFilterGroups(response.data.groups || [])
        setFilterValues(response.data.values || {})
      }
    } catch (error) {
      console.error('Failed to load filters:', error)
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

      console.log('🔍 Filter Parameters:', filterParams)

      // Call the API with filters
      const response = await propertyService.getMyProperties(currentPage, itemsPerPage, filterParams)
      
      if (response && response.data) {
        setProperties(response.data)  // ONLY this line needed
        
        if (response.meta) {
          setTotalPages(response.meta.last_page || 1)
          setTotalProperties(response.meta.total || response.data.length)
        }
      }
    } catch (error) {
      console.error('Failed to load properties:', error)
      setProperties([])  // ONLY this line needed
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterKey: string, value: any) => {
    console.log('🔧 Filter changed:', filterKey, '=', value)
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
    setCurrentPage(1)
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

  // Get filter options for dropdowns
  const getPropertyTypeOptions = () => {
    const types = filterValues['property_type'] || []
    return [
      { value: '', label: 'All Types' },
      ...types.map(type => ({ value: type.value, label: type.label }))
    ]
  }

  const getPropertyStatusOptions = () => {
    const statuses = filterValues['property_status'] || []
    return [
      { value: '', label: 'All Status' },
      ...statuses.map(status => ({ value: status.value, label: status.label }))
    ]
  }

  const getBedroomOptions = () => [
    { value: '', label: 'Any Bedrooms' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5', label: '5+ Bedrooms' }
  ]

  const getBathroomOptions = () => [
    { value: '', label: 'Any Bathrooms' },
    { value: '1', label: '1+ Bathroom' },
    { value: '2', label: '2+ Bathrooms' },
    { value: '3', label: '3+ Bathrooms' },
    { value: '4', label: '4+ Bathrooms' }
  ]

  const getSortOptions = () => [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' }
  ]

  const handleViewProperty = (property: Property) => {
    router.push(`/properties/${property.slug || property.id}`)
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
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete property')
    }
  }

  const formatPrice = (property: Property) => {
    return property.price?.formatted || `$${property.price?.value?.toLocaleString()}` || 'Price not available'
  }

  const getPropertyImage = (property: Property) => {
    return property.media?.primary_image || property.media?.images?.[0] || '/images/banner-1.jpg'
  }

  // Property Card Component
  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={getPropertyImage(property)}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.price?.type === 'sale' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {property.price?.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        {property.status?.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className={`font-semibold text-lg text-gray-900 mb-1 ${MontserratFont.className}`}>
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {property.location?.full_address}
          </p>
          <p className="text-xl font-bold text-[var(--primary)]">
            {formatPrice(property)}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <span>{property.bedrooms || 0} beds</span>
            <span>{property.bathrooms || 0} baths</span>
            <span>{property.square_footage || 0} sqft</span>
          </div>
        </div>

        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            Agent: <span className="font-medium">{property.agent?.name}</span>
          </p>
        </div>

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteProperty(property.id)}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )

  // if (loadingFilters) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
  //       <span className="ml-3">Loading filters...</span>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
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
              Manage your property listings ({totalProperties} total)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="dark" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 border"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white hover:bg-gray-50 text-[var(--primary)] border-0"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => router.push('/dashboard/properties/add')}
            >
              Add Property
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-6 mx-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

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

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="rounded border-gray-300 text-[var(--primary)]"
                />
                <span className="text-sm">Featured only</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Properties */}
      <div className='mx-6 mb-8'>
        {loading || loadingFilters ? (
          <div className="flex items-center justify-center py-12 mx-6 mb-8 min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
            <span className="ml-3">Loading properties...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-12">
                <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">
                  No properties match your search criteria.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

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
    </div>
  )
}

export default PropertiesPage
