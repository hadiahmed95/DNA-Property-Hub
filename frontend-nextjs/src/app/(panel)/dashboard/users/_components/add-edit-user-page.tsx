'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'
import Button from '@/components/button'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import { 
  UsersIcon,
  EditIcon,
  PlusIcon,
  EyeIcon,
  ArrowUpIcon
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../../../../fonts'

interface UserFormData {
  // Basic Information
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  
  // Profile Information
  avatar: File | null
  role: string
  department: string
  location: string
  employeeId: string
  
  // Contact Details
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  emergencyContact: string
  emergencyPhone: string
  
  // Professional Details
  title: string
  startDate: string
  manager: string
  skills: string[]
  certifications: string[]
  
  // Settings
  status: 'active' | 'inactive' | 'pending'
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  twoFactorAuth: boolean
  
  // Permissions (if custom role)
  customPermissions: string[]
}

interface Role {
  value: string
  label: string
  description: string
  color: string
}

const AddEditUserPage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false) // This would come from route params
  const [showPassword, setShowPassword] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState<UserFormData>({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Profile Information
    avatar: null,
    role: '',
    department: '',
    location: '',
    employeeId: '',
    
    // Contact Details
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Professional Details
    title: '',
    startDate: '',
    manager: '',
    skills: [],
    certifications: [],
    
    // Settings
    status: 'active',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    twoFactorAuth: false,
    
    // Permissions
    customPermissions: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Personal information and credentials' },
    { id: 2, title: 'Profile', description: 'Role, department, and professional details' },
    { id: 3, title: 'Contact', description: 'Address and emergency contact' },
    { id: 4, title: 'Settings', description: 'Preferences and permissions' },
    { id: 5, title: 'Review', description: 'Review and confirm details' }
  ]

  // Role options
  const roleOptions: Role[] = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system access', color: 'bg-purple-500' },
    { value: 'admin', label: 'Admin', description: 'Administrative access', color: 'bg-red-500' },
    { value: 'manager', label: 'Manager', description: 'Team management', color: 'bg-blue-500' },
    { value: 'agent', label: 'Agent', description: 'Property and client management', color: 'bg-green-500' },
    { value: 'client', label: 'Client', description: 'Property viewing access', color: 'bg-amber-500' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access', color: 'bg-gray-500' }
  ]

  const departmentOptions = [
    { value: 'administration', label: 'Administration' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' }
  ]

  const locationOptions = [
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'miami', label: 'Miami, FL' },
    { value: 'san-francisco', label: 'San Francisco, CA' },
    { value: 'remote', label: 'Remote' }
  ]

  const stateOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'CA', label: 'California' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' }
  ]

  const skillsOptions = [
    'Real Estate Sales', 'Property Management', 'Marketing', 'Customer Service',
    'Data Analysis', 'Project Management', 'Communication', 'Leadership',
    'Negotiation', 'Market Research', 'CRM Systems', 'Social Media Marketing'
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
      [field]: (prev[field as keyof UserFormData] as string[]).includes(value)
        ? (prev[field as keyof UserFormData] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof UserFormData] as string[]), value]
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
        if (!isEditing) {
          if (!formData.password) newErrors.password = 'Password is required'
          else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
          if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
        }
        break
      case 2:
        if (!formData.role) newErrors.role = 'Role is required'
        if (!formData.department) newErrors.department = 'Department is required'
        if (!formData.location) newErrors.location = 'Location is required'
        if (!formData.title.trim()) newErrors.title = 'Job title is required'
        break
      case 3:
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
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

  const handleAvatarUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, avatar: files[0] }))
    }
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
    handleAvatarUpload(e.dataTransfer.files)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('User data:', formData)
      router.push('/dashboard/users')
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSelectedRole = () => {
    return roleOptions.find(role => role.value === formData.role)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div
                  className={`w-32 h-32 rounded-full border-4 border-dashed transition-all duration-300 flex items-center justify-center ${
                    dragActive ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.avatar ? (
                    <div className="w-full h-full rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-4xl font-bold">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">👤</div>
                      <div className="text-sm text-gray-600">Upload Photo</div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name *"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
              />
              <Input
                label="Last Name *"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
              />
            </div>

            <Input
              label="Email Address *"
              type="email"
              placeholder="john.smith@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
            />

            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label="Password *"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
                <Input
                  label="Confirm Password *"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                />
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Role *"
                  options={roleOptions.map(role => ({ value: role.value, label: role.label }))}
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Select role"
                  error={errors.role}
                />
                {formData.role && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 ${getSelectedRole()?.color} rounded`}></div>
                      <span className="text-sm text-gray-700">{getSelectedRole()?.description}</span>
                    </div>
                  </div>
                )}
              </div>
              <Select
                label="Department *"
                options={departmentOptions}
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Select department"
                error={errors.department}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Job Title *"
                placeholder="Senior Real Estate Agent"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
              />
              <Select
                label="Office Location *"
                options={locationOptions}
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Select location"
                error={errors.location}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Employee ID"
                placeholder="EMP001"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
              />
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <Input
              label="Manager"
              placeholder="Select reporting manager"
              value={formData.manager}
              onChange={(e) => handleInputChange('manager', e.target.value)}
            />

            {/* Skills Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Skills & Expertise
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skillsOptions.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleArrayToggle('skills', skill)}
                      className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20"
                    />
                    <span className={`text-sm text-gray-700 ${popinsFont['500'].className}`}>
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Input
              label="Phone Number *"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
            />

            <Input
              label="Address"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="City"
                placeholder="New York"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              <Select
                label="State"
                options={stateOptions}
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Select state"
              />
              <Input
                label="ZIP Code"
                placeholder="10001"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>

            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />

            <div className="border-t pt-6">
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Emergency Contact Name"
                  placeholder="Jane Doe"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                />
                <Input
                  label="Emergency Contact Phone"
                  placeholder="+1 (555) 987-6543"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            {/* Account Status */}
            <div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Account Status
              </h3>
              <Select
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending Approval' }
                ]}
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                placeholder="Select status"
              />
            </div>

            {/* Notification Preferences */}
            <div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Get urgent notifications via text message' },
                  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Subscribe to company newsletters and promotions' }
                ].map((setting) => (
                  <label key={setting.key} className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData[setting.key as keyof UserFormData] as boolean}
                      onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                      className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20 mt-0.5"
                    />
                    <div>
                      <div className={`font-medium text-gray-900 ${popinsFont['600'].className}`}>
                        {setting.label}
                      </div>
                      <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                        {setting.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Security Settings
              </h3>
              <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-200">
                <input
                  type="checkbox"
                  checked={formData.twoFactorAuth}
                  onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                  className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20 mt-0.5"
                />
                <div>
                  <div className={`font-medium text-gray-900 ${popinsFont['600'].className} flex items-center`}>
                    Two-Factor Authentication
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Recommended</span>
                  </div>
                  <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                    Add an extra layer of security to this account
                  </div>
                </div>
              </label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            {/* User Summary */}
            <Card variant="gradient">
              <div className="flex items-start space-x-6">
                <div className={`w-20 h-20 ${getSelectedRole()?.color || 'bg-gray-500'} rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold text-gray-900 mb-2 ${MontserratFont.className}`}>
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className={`text-lg text-gray-700 mb-2 ${popinsFont['600'].className}`}>
                    {formData.title}
                  </p>
                  <p className={`text-gray-600 mb-4 ${popinsFont['400'].className}`}>
                    {formData.email} • {formData.phone}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getSelectedRole()?.color} text-white`}>
                      {getSelectedRole()?.label}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {departmentOptions.find(d => d.value === formData.department)?.label}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      formData.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Professional Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{departmentOptions.find(d => d.value === formData.department)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{locationOptions.find(l => l.value === formData.location)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee ID:</span>
                    <span className="font-medium">{formData.employeeId || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formData.startDate || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manager:</span>
                    <span className="font-medium">{formData.manager || 'Not assigned'}</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Contact Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{formData.address || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City, State:</span>
                    <span className="font-medium">
                      {formData.city && formData.state ? `${formData.city}, ${formData.state}` : 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ZIP Code:</span>
                    <span className="font-medium">{formData.zipCode || 'Not provided'}</span>
                  </div>
                  {formData.emergencyContact && (
                    <>
                      <div className="flex justify-between border-t pt-3 mt-3">
                        <span className="text-gray-600">Emergency Contact:</span>
                        <span className="font-medium">{formData.emergencyContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emergency Phone:</span>
                        <span className="font-medium">{formData.emergencyPhone}</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Skills & Expertise
                </h4>
                {formData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={`text-gray-500 text-sm ${popinsFont['400'].className}`}>
                    No skills selected
                  </p>
                )}
              </Card>

              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Account Settings
                </h4>
                <div className="space-y-3">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications' },
                    { key: 'smsNotifications', label: 'SMS Notifications' },
                    { key: 'marketingEmails', label: 'Marketing Emails' },
                    { key: 'twoFactorAuth', label: 'Two-Factor Authentication' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{setting.label}:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData[setting.key as keyof UserFormData]
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {formData[setting.key as keyof UserFormData] ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Role Permissions Preview */}
            {formData.role && (
              <Card>
                <h4 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Role Permissions Preview
                </h4>
                <div className="text-center py-8">
                  <div className={`w-16 h-16 ${getSelectedRole()?.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    🛡️
                  </div>
                  <h5 className={`text-lg font-semibold text-gray-900 mb-2 ${MontserratFont.className}`}>
                    {getSelectedRole()?.label} Role
                  </h5>
                  <p className={`text-gray-600 mb-4 ${popinsFont['400'].className}`}>
                    {getSelectedRole()?.description}
                  </p>
                  <p className={`text-sm text-gray-500 ${popinsFont['400'].className}`}>
                    This user will have all permissions associated with the {getSelectedRole()?.label} role
                  </p>
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
              {isEditing ? 'Edit User' : 'Add New User'}
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              {isEditing 
                ? 'Update user information, role assignments, and account settings.' 
                : 'Create a new user account with role-based permissions and access controls.'}
            </p>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-5 h-5" />
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
              <div className="text-5xl">👤</div>
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
                onClick={() => router.push('/dashboard/users')}
              >
                Cancel
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
                  {isEditing ? 'Update User' : 'Create User'}
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

export default AddEditUserPage