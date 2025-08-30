'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'
import Button from '@/components/button'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import { 
  HomeIcon,
  DollarIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpIcon
} from '@/components/icons'
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
  halfBathrooms: string
  squareFootage: string
  lotSize: string
  yearBuilt: string
  floors: string
  
  // Pricing
  price: string
  priceType: string
  hoa: string
  propertyTax: string
  
  // Features & Amenities
  features: string[]
  amenities: string[]
  appliances: string[]
  
  // Contact & Agent
  agentName: string
  agentEmail: string
  agentPhone: string
  
  // Images & Media
  images: File[]
  virtualTour: string
  
  // Additional Details
  parking: string
  garage: string
  heating: string
  cooling: string
  flooring: string[]
  utilities: string[]
  
  // Marketing
  featured: boolean
  showAddress: boolean
  allowShowings: boolean
  openHouse: boolean
  openHouseDate: string
  openHouseTime: string
}

const AddPropertyPage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    // Basic Information
    title: '',
    description: '',
    propertyType: '',
    status: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    neighborhood: '',
    
    // Property Details
    bedrooms: '',
    bathrooms: '',
    halfBathrooms: '',
    squareFootage: '',
    lotSize: '',
    yearBuilt: '',
    floors: '',
    
    // Pricing
    price: '',
    priceType: 'sale',
    hoa: '',
    propertyTax: '',
    
    // Features & Amenities
    features: [],
    amenities: [],
    appliances: [],
    
    // Contact & Agent
    agentName: '',
    agentEmail: '',
    agentPhone: '',
    
    // Images & Media
    images: [],
    virtualTour: '',
    
    // Additional Details
    parking: '',
    garage: '',
    heating: '',
    cooling: '',
    flooring: [],
    utilities: [],
    
    // Marketing
    featured: false,
    showAddress: true,
    allowShowings: true,
    openHouse: false,
    openHouseDate: '',
    openHouseTime: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Property details and description' },
    { id: 2, title: 'Location', description: 'Address and neighborhood' },
    { id: 3, title: 'Details', description: 'Specifications and features' },
    { id: 4, title: 'Pricing', description: 'Price and financial details' },
    { id: 5, title: 'Media', description: 'Photos and virtual tours' },
    { id: 6, title: 'Review', description: 'Final review and publish' }
  ]

  // Options for select fields
  const propertyTypeOptions = [
    { value: 'house', label: 'Single Family House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land/Lot' }
  ]

  const statusOptions = [
    { value: 'for-sale', label: 'For Sale' },
    { value: 'for-rent', label: 'For Rent' },
    { value: 'sold', label: 'Sold' },
    { value: 'pending', label: 'Pending' },
    { value: 'off-market', label: 'Off Market' }
  ]

  const stateOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    // Add more states as needed
  ]

  const bedroomOptions = [
    { value: '0', label: 'Studio' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5', label: '5 Bedrooms' },
    { value: '6+', label: '6+ Bedrooms' }
  ]

  const bathroomOptions = [
    { value: '1', label: '1 Bathroom' },
    { value: '1.5', label: '1.5 Bathrooms' },
    { value: '2', label: '2 Bathrooms' },
    { value: '2.5', label: '2.5 Bathrooms' },
    { value: '3', label: '3 Bathrooms' },
    { value: '3.5', label: '3.5 Bathrooms' },
    { value: '4', label: '4 Bathrooms' },
    { value: '4+', label: '4+ Bathrooms' }
  ]

  const featuresOptions = [
    'Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 
    'Walk-in Closet', 'Fireplace', 'Balcony/Deck', 'Swimming Pool', 
    'Gym/Fitness Center', 'Garage', 'Garden', 'Air Conditioning', 
    'Central Heating', 'Security System', 'Pet Friendly'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof PropertyFormData] as string[]).includes(value)
        ? (prev[field as keyof PropertyFormData] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof PropertyFormData] as string[]), value]
    }))
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
      case 3:
        if (!formData.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required'
        if (!formData.bathrooms) newErrors.bathrooms = 'Number of bathrooms is required'
        if (!formData.squareFootage.trim()) newErrors.squareFootage = 'Square footage is required'
        break
      case 4:
        if (!formData.price.trim()) newErrors.price = 'Price is required'
        if (isNaN(Number(formData.price.replace(/[^0-9]/g, '')))) newErrors.price = 'Please enter a valid price'
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

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 10 - formData.images.length)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Property data:', formData)
      router.push('/dashboard/properties')
    } catch (error) {
      console.error('Error saving property:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
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
              <Select
                label="Property Type *"
                options={propertyTypeOptions}
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                placeholder="Select property type"
                error={errors.propertyType}
              />
            </div>

            <Select
              label="Status *"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              placeholder="Select status"
              error={errors.status}
            />

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
                    ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Input
              label="Street Address *"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="City *"
                placeholder="New York"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={errors.city}
              />
              <Select
                label="State *"
                options={stateOptions}
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Select state"
                error={errors.state}
              />
              <Input
                label="ZIP Code *"
                placeholder="10001"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                error={errors.zipCode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Neighborhood"
                placeholder="e.g., Downtown, Midtown"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Bedrooms *"
                options={bedroomOptions}
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="Select bedrooms"
                error={errors.bedrooms}
              />
              <Select
                label="Bathrooms *"
                options={bathroomOptions}
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="Select bathrooms"
                error={errors.bathrooms}
              />
              <Input
                label="Half Baths"
                type="number"
                placeholder="0"
                value={formData.halfBathrooms}
                onChange={(e) => handleInputChange('halfBathrooms', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Square Footage *"
                placeholder="2,500"
                value={formData.squareFootage}
                onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                error={errors.squareFootage}
              />
              <Input
                label="Lot Size (sq ft)"
                placeholder="5,000"
                value={formData.lotSize}
                onChange={(e) => handleInputChange('lotSize', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Year Built"
                type="number"
                placeholder="2020"
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
              />
              <Input
                label="Number of Floors"
                type="number"
                placeholder="2"
                value={formData.floors}
                onChange={(e) => handleInputChange('floors', e.target.value)}
              />
            </div>

            {/* Features Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Property Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {featuresOptions.map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleArrayToggle('features', feature)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                          formData.features.includes(feature)
                            ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                            : 'border-gray-300 hover:border-[var(--primary)]'
                        }`}
                      >
                        {formData.features.includes(feature) && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm text-gray-700 ${popinsFont['500'].className}`}>
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            </div>
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
                  { value: 'rent-monthly', label: 'Monthly Rent' },
                  { value: 'rent-weekly', label: 'Weekly Rent' }
                ]}
                value={formData.priceType}
                onChange={(e) => handleInputChange('priceType', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="HOA Fees (Monthly)"
                placeholder="250"
                value={formData.hoa}
                onChange={(e) => handleInputChange('hoa', e.target.value)}
              />
              <Input
                label="Property Tax (Annual)"
                placeholder="8,500"
                value={formData.propertyTax}
                onChange={(e) => handleInputChange('propertyTax', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Agent Name"
                placeholder="John Smith"
                value={formData.agentName}
                onChange={(e) => handleInputChange('agentName', e.target.value)}
              />
              <Input
                label="Agent Email"
                type="email"
                placeholder="john@example.com"
                value={formData.agentEmail}
                onChange={(e) => handleInputChange('agentEmail', e.target.value)}
              />
              <Input
                label="Agent Phone"
                placeholder="(555) 123-4567"
                value={formData.agentPhone}
                onChange={(e) => handleInputChange('agentPhone', e.target.value)}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Property Images (Max 10)
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                    : 'border-gray-300 hover:border-[var(--primary)]/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center text-[var(--primary)] text-2xl mx-auto">
                    📷
                  </div>
                  <div>
                    <p className={`text-lg font-semibold text-gray-900 ${MontserratFont.className}`}>
                      Drop images here or click to upload
                    </p>
                    <p className={`text-gray-600 ${popinsFont['400'].className}`}>
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-amber-500 flex items-center justify-center text-white text-2xl">
                          🏠
                        </div>
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-[var(--primary)] text-white text-xs px-2 py-1 rounded-full">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Virtual Tour URL"
              placeholder="https://..."
              value={formData.virtualTour}
              onChange={(e) => handleInputChange('virtualTour', e.target.value)}
            />

            {/* Marketing Options */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Marketing Options
              </label>
              
              <div className="space-y-3">
                {[
                  { key: 'featured', label: 'Mark as Featured Property', description: 'Highlight this property in listings' },
                  { key: 'showAddress', label: 'Show Full Address', description: 'Display complete address publicly' },
                  { key: 'allowShowings', label: 'Allow Showings', description: 'Enable appointment scheduling' },
                  { key: 'openHouse', label: 'Schedule Open House', description: 'Set open house dates and times' }
                ].map((option) => (
                  <label key={option.key} className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={formData[option.key as keyof PropertyFormData] as boolean}
                        onChange={(e) => handleInputChange(option.key, e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                          formData[option.key as keyof PropertyFormData]
                            ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                            : 'border-gray-300 hover:border-[var(--primary)]'
                        }`}
                      >
                        {formData[option.key as keyof PropertyFormData] && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className={`font-medium text-gray-900 ${popinsFont['500'].className}`}>
                        {option.label}
                      </div>
                      <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {formData.openHouse && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <Input
                    label="Open House Date"
                    type="date"
                    value={formData.openHouseDate}
                    onChange={(e) => handleInputChange('openHouseDate', e.target.value)}
                  />
                  <Input
                    label="Open House Time"
                    type="time"
                    value={formData.openHouseTime}
                    onChange={(e) => handleInputChange('openHouseTime', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-8">
            {/* Property Summary */}
            <Card variant="gradient">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                  🏠
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold text-gray-900 mb-2 ${MontserratFont.className}`}>
                    {formData.title || 'Property Title'}
                  </h3>
                  <p className={`text-gray-600 mb-4 ${popinsFont['400'].className}`}>
                    {formData.description || 'No description provided'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      🏠 {propertyTypeOptions.find(t => t.value === formData.propertyType)?.label}
                    </span>
                    <span className="flex items-center">
                      📍 {formData.city}, {formData.state}
                    </span>
                    <span className="flex items-center">
                      🛏️ {formData.bedrooms} beds
                    </span>
                    <span className="flex items-center">
                      🚿 {formData.bathrooms} baths
                    </span>
                    <span className="flex items-center">
                      📐 {formData.squareFootage} sq ft
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold text-[var(--primary)] ${MontserratFont.className}`}>
                    ${formData.price || '0'}
                  </div>
                  <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                    {statusOptions.find(s => s.value === formData.status)?.label}
                  </div>
                </div>
              </div>
            </Card>

            {/* Review Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Location Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{formData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City, State:</span>
                    <span className="font-medium">{formData.city}, {formData.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ZIP Code:</span>
                    <span className="font-medium">{formData.zipCode}</span>
                  </div>
                  {formData.neighborhood && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Neighborhood:</span>
                      <span className="font-medium">{formData.neighborhood}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Property Features
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{formData.yearBuilt || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lot Size:</span>
                    <span className="font-medium">{formData.lotSize || 'N/A'} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floors:</span>
                    <span className="font-medium">{formData.floors || 'N/A'}</span>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-600 block mb-2">Selected Features:</span>
                      <div className="flex flex-wrap gap-1">
                        {formData.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                        {formData.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{formData.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Financial Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Type:</span>
                    <span className="font-medium capitalize">{formData.priceType.replace('-', ' ')}</span>
                  </div>
                  {formData.hoa && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">HOA Fees:</span>
                      <span className="font-medium">${formData.hoa}/month</span>
                    </div>
                  )}
                  {formData.propertyTax && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax:</span>
                      <span className="font-medium">${formData.propertyTax}/year</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Marketing Settings
                </h4>
                <div className="space-y-3">
                  {[
                    { key: 'featured', label: 'Featured Property' },
                    { key: 'showAddress', label: 'Show Full Address' },
                    { key: 'allowShowings', label: 'Allow Showings' },
                    { key: 'openHouse', label: 'Open House Scheduled' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{setting.label}:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData[setting.key as keyof PropertyFormData]
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {formData[setting.key as keyof PropertyFormData] ? 'Yes' : 'No'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Images Summary */}
            {formData.images.length > 0 && (
              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Uploaded Images ({formData.images.length})
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {formData.images.slice(0, 8).map((_, index) => (
                    <div key={index} className="aspect-square bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-lg flex items-center justify-center text-white text-xl">
                      🏠
                    </div>
                  ))}
                  {formData.images.length > 8 && (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm font-medium">
                      +{formData.images.length - 8}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Agent Information */}
            {(formData.agentName || formData.agentEmail || formData.agentPhone) && (
              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Agent Information
                </h4>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold">
                    {formData.agentName.charAt(0) || 'A'}
                  </div>
                  <div>
                    {formData.agentName && (
                      <div className={`font-semibold text-gray-900 ${popinsFont['600'].className}`}>
                        {formData.agentName}
                      </div>
                    )}
                    {formData.agentEmail && (
                      <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                        {formData.agentEmail}
                      </div>
                    )}
                    {formData.agentPhone && (
                      <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                        {formData.agentPhone}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
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
              Add New Property
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              Create a comprehensive property listing with detailed information, images, and features to attract potential buyers or renters.
            </p>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <HomeIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>Step {currentStep} of {steps.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <EditIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>{steps[currentStep - 1]?.title}</span>
              </div>
            </div>
          </div>
          <div className="text-white">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-center border border-white/20">
              <div className="text-5xl">🏠</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mx-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${step.id < steps.length ? 'flex-1' : ''}`}
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
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard/properties')}
              >
                Save as Draft
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  className="flex items-center"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  className="flex items-center"
                  icon={<PlusIcon className="w-4 h-4" />}
                >
                  Publish Property
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Save Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <Button
          variant="primary"
          size="lg"
          className="w-14 h-14 rounded-full shadow-2xl"
          onClick={() => {
            if (currentStep < steps.length) {
              nextStep()
            } else {
              handleSubmit()
            }
          }}
          loading={loading}
        >
          {currentStep < steps.length ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <PlusIcon className="w-6 h-6" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default AddPropertyPage