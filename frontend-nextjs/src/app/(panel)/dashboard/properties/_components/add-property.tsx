'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'
import Button from '@/components/button'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import propertyService from '@/services/property.service'
import filterService from '@/services/filter.service'
import { MontserratFont, popinsFont } from '../../../../fonts'

interface PropertyFormData {
  // Basic Information
  title: string
  description: string
  propertyType: string
  status: string
  
  // Location
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  neighborhood: string
  
  // Property Details
  bedrooms: string
  bathrooms: string
  squareFootage: string
  
  // Pricing
  price: string
  priceType: string
  
  // Contact & Agent
  agentName: string
  agentEmail: string
  agentPhone: string
  
  // Dynamic filters
  selectedFilters: Record<string, string[]>
}

const AddPropertyPage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filterGroups, setFilterGroups] = useState<any[]>([])
  const [filterValues, setFilterValues] = useState<Record<string, any[]>>({})
  const [loadingFilters, setLoadingFilters] = useState(true)
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: '',
    status: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    price: '',
    priceType: 'sale',
    agentName: '',
    agentEmail: '',
    agentPhone: '',
    selectedFilters: {}
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Property details and description' },
    { id: 2, title: 'Location', description: 'Address and neighborhood' },
    { id: 3, title: 'Details', description: 'Specifications and features' },
    { id: 4, title: 'Pricing', description: 'Price and agent details' },
    { id: 5, title: 'Review', description: 'Final review and publish' }
  ]

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    setLoadingFilters(true)
    try {
      const response = await filterService.getAllFiltersForForm()
      
      if (response.success && response.data) {
        setFilterGroups(response.data.groups || [])
        setFilterValues(response.data.values || {})
        
        // Clear any previous errors
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.filters
          return newErrors
        })
      } else {
        console.error('❌ API response not successful:', response)
        setErrors({ filters: response.error || 'Failed to load filter options' })
      }
    } catch (error) {
      console.error('💥 Exception in loadFilterOptions:', error)
      setErrors({ filters: 'Failed to load filter options due to network error' })
    } finally {
      setLoadingFilters(false)
    }
  }

  // Get property type options from loaded filters (NO STATIC VALUES)
  const getPropertyTypeOptions = () => {
    const propertyTypeGroup = filterGroups.find(group => group.slug === 'property_type')
    if (!propertyTypeGroup) return []
    
    const values = filterValues[propertyTypeGroup.slug] || []
    return values.map(value => ({
      value: value.value,
      label: value.label
    }))
  }

  // Get status options from loaded filters (NO STATIC VALUES)
  const getStatusOptions = () => {
    const statusGroup = filterGroups.find(group => group.slug === 'property_status')
    if (!statusGroup) return []
    
    const values = filterValues[statusGroup.slug] || []
    return values.map(value => ({
      value: value.value,
      label: value.label
    }))
  }

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleFilterChange = (groupSlug: string, valueId: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev.selectedFilters[groupSlug] || []
      let newValues: string[]
      
      if (checked) {
        newValues = [...currentValues, valueId]
      } else {
        newValues = currentValues.filter(id => id !== valueId)
      }
      
      return {
        ...prev,
        selectedFilters: {
          ...prev.selectedFilters,
          [groupSlug]: newValues
        }
      }
    })
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Property title is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.propertyType) newErrors.propertyType = 'Property type is required'
        if (!formData.status) newErrors.status = 'Status is required'
        break
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.state) newErrors.state = 'State is required'
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
        break
      case 4:
        if (!formData.price.trim()) newErrors.price = 'Price is required'
        if (isNaN(Number(formData.price.replace(/[^0-9]/g, '')))) newErrors.price = 'Please enter a valid price'
        if (!formData.agentName.trim()) newErrors.agentName = 'Agent name is required'
        if (!formData.agentEmail.trim()) newErrors.agentEmail = 'Agent email is required'
        if (!formData.agentPhone.trim()) newErrors.agentPhone = 'Agent phone is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // Convert formData to API format
      const filters: Record<string, number[]> = {}
      
      filterGroups.forEach(group => {
        const selectedValues = formData.selectedFilters[group.slug] || []
        if (selectedValues.length > 0) {
          filters[group.id.toString()] = selectedValues.map(id => parseInt(id))
        }
      })

      const submitData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price.replace(/[^0-9.]/g, '')),
        price_type: formData.priceType as 'sale' | 'rent_monthly' | 'rent_weekly',
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseFloat(formData.bathrooms) || 0,
        square_footage: parseInt(formData.squareFootage) || 0,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        agent_info: {
          name: formData.agentName,
          email: formData.agentEmail,
          phone: formData.agentPhone
        },
        filters
      }

      const response = await propertyService.createProperty(submitData)
      
      if (response.success) {
        router.push('/dashboard/properties')
      } else {
        setErrors({ submit: response.error || 'Failed to create property' })
      }
    } catch (error) {
      console.error('Error creating property:', error)
      setErrors({ submit: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  // Show loading while filters are loading
  if (loadingFilters) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading filter options...</p>
        </div>
      </div>
    )
  }

  // Show error if filters failed to load
  if (errors.filters) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{errors.filters}</p>
          <Button onClick={loadFilterOptions}>Retry</Button>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const propertyTypeOptions = getPropertyTypeOptions()
        const statusOptions = getStatusOptions()
        
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Property Title *"
                placeholder="e.g., Beautiful Modern Villa"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
              />
              
              {propertyTypeOptions.length > 0 ? (
                <Select
                  label="Property Type *"
                  options={[{ value: '', label: 'Select property type' }, ...propertyTypeOptions]}
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  error={errors.propertyType}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <div className="text-gray-500 text-sm">Loading property types...</div>
                </div>
              )}
            </div>

            {statusOptions.length > 0 ? (
              <Select
                label="Status *"
                options={[{ value: '', label: 'Select status' }, ...statusOptions]}
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                error={errors.status}
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <div className="text-gray-500 text-sm">Loading status options...</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Description *
              </label>
              <textarea
                rows={6}
                placeholder="Describe the property, its features, and what makes it special..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-[var(--primary)] focus:border-[var(--primary)]'
                } focus:ring-2 focus:outline-none`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Input
              label="Street Address *"
              placeholder="123 Ocean Drive"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="City *"
                placeholder="Miami"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={errors.city}
              />
              <Input
                label="State *"
                placeholder="FL"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                error={errors.state}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="ZIP Code *"
                placeholder="33139"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                error={errors.zipCode}
              />
              <Input
                label="Neighborhood"
                placeholder="South Beach"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Bedrooms"
                type="number"
                placeholder="4"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              />
              <Input
                label="Bathrooms"
                type="number"
                step="0.5"
                placeholder="3.5"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              />
              <Input
                label="Square Footage"
                type="number"
                placeholder="2500"
                value={formData.squareFootage}
                onChange={(e) => handleInputChange('squareFootage', e.target.value)}
              />
            </div>

            {/* ONLY Dynamic Filters from API - NO static values */}
            {filterGroups
              .filter(group => !['property_type', 'property_status'].includes(group.slug)) // Exclude already used groups
              .map((group) => (
              <div key={group.id} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  {group.name}
                  {group.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filterValues[group.slug]?.map((value: any) => (
                    <label
                      key={value.id}
                      className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <input
                        type={group.is_multiple ? "checkbox" : "radio"}
                        name={group.slug}
                        checked={formData.selectedFilters[group.slug]?.includes(value.id.toString()) || false}
                        onChange={(e) => {
                          if (group.is_multiple) {
                            handleFilterChange(group.slug, value.id.toString(), e.target.checked)
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              selectedFilters: {
                                ...prev.selectedFilters,
                                [group.slug]: e.target.checked ? [value.id.toString()] : []
                              }
                            }))
                          }
                        }}
                        className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {value.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price *"
                placeholder="850,000"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                error={errors.price}
              />
              <Select
                label="Price Type"
                options={[
                  { value: 'sale', label: 'For Sale' },
                  { value: 'rent_monthly', label: 'Monthly Rent' },
                  { value: 'rent_weekly', label: 'Weekly Rent' }
                ]}
                value={formData.priceType}
                onChange={(e) => handleInputChange('priceType', e.target.value)}
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Agent Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Agent Name *"
                placeholder="John Smith"
                value={formData.agentName}
                onChange={(e) => handleInputChange('agentName', e.target.value)}
                error={errors.agentName}
              />
              <Input
                label="Agent Email *"
                type="email"
                placeholder="john@agent.com"
                value={formData.agentEmail}
                onChange={(e) => handleInputChange('agentEmail', e.target.value)}
                error={errors.agentEmail}
              />
              <Input
                label="Agent Phone *"
                placeholder="+1-305-555-0123"
                value={formData.agentPhone}
                onChange={(e) => handleInputChange('agentPhone', e.target.value)}
                error={errors.agentPhone}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="ml-2 text-gray-900">{formData.title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="ml-2 text-gray-900">${parseFloat(formData.price.replace(/[^0-9.]/g, '') || '0').toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <span className="ml-2 text-gray-900">{formData.address}, {formData.city}, {formData.state}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Agent:</span>
                  <span className="ml-2 text-gray-900">{formData.agentName}</span>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl font-bold text-gray-900 ${MontserratFont.className}`}>
            Add New Property
          </h1>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step.id < currentStep
                        ? 'bg-emerald-500 text-white'
                        : step.id === currentStep
                        ? 'bg-[var(--primary)] text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <div className="mt-2 text-center hidden sm:block">
                    <div className={`text-sm font-semibold ${
                      step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    } ${popinsFont['600'].className}`}>
                      {step.title}
                    </div>
                    <div className={`text-xs text-gray-500 ${popinsFont['400'].className}`}>
                      {step.description}
                    </div>
                  </div>
                </div>
                {step.id < steps.length && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      step.id < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Form Content */}
      <div className="mx-6 mb-8">
        <Card className="p-8 lg:p-12">
          {renderStepContent()}
        </Card>
      </div>

      {/* Navigation */}
      <div className="mx-6 mb-8">
        <Card>
          <div className="flex items-center justify-between p-6">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard/properties')}
              >
                Cancel
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={loading}
                  className="flex items-center"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish Property
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AddPropertyPage
