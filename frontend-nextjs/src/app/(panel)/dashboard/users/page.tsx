'use client'

import React, { useState, useEffect } from 'react'
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
  UsersIcon,
  DollarIcon,
  HomeIcon,
  AnalyticsIcon
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../../../fonts'

// User Types and Interfaces
export type UserRole = 'super_admin' | 'admin' | 'agent' | 'manager' | 'client' | 'viewer'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  avatar: string
  phone: string
  joinedDate: string
  lastLogin: string
  propertiesManaged: number
  totalSales: string
  department: string
  location: string
  permissions: string[]
  isVerified: boolean
}

export interface RolePermissions {
  role: UserRole
  name: string
  description: string
  color: string
  permissions: {
    properties: ('create' | 'read' | 'update' | 'delete')[]
    users: ('create' | 'read' | 'update' | 'delete')[]
    analytics: ('read' | 'export')[]
    settings: ('read' | 'update')[]
    clients: ('create' | 'read' | 'update' | 'delete')[]
  }
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all',
    location: 'all',
    sortBy: 'newest'
  })

  // Role Definitions
  const roleDefinitions: RolePermissions[] = [
    {
      role: 'super_admin',
      name: 'Super Admin',
      description: 'Full system access and control',
      color: 'bg-purple-500',
      permissions: {
        properties: ['create', 'read', 'update', 'delete'],
        users: ['create', 'read', 'update', 'delete'],
        analytics: ['read', 'export'],
        settings: ['read', 'update'],
        clients: ['create', 'read', 'update', 'delete']
      }
    },
    {
      role: 'admin',
      name: 'Admin',
      description: 'Administrative access with user management',
      color: 'bg-red-500',
      permissions: {
        properties: ['create', 'read', 'update', 'delete'],
        users: ['create', 'read', 'update'],
        analytics: ['read', 'export'],
        settings: ['read'],
        clients: ['create', 'read', 'update', 'delete']
      }
    },
    {
      role: 'manager',
      name: 'Manager',
      description: 'Team management and property oversight',
      color: 'bg-blue-500',
      permissions: {
        properties: ['create', 'read', 'update'],
        users: ['read', 'update'],
        analytics: ['read'],
        settings: ['read'],
        clients: ['create', 'read', 'update']
      }
    },
    {
      role: 'agent',
      name: 'Agent',
      description: 'Property and client management',
      color: 'bg-green-500',
      permissions: {
        properties: ['create', 'read', 'update'],
        users: ['read'],
        analytics: ['read'],
        settings: ['read'],
        clients: ['create', 'read', 'update']
      }
    },
    {
      role: 'client',
      name: 'Client',
      description: 'Property viewing and inquiry access',
      color: 'bg-amber-500',
      permissions: {
        properties: ['read'],
        users: [],
        analytics: [],
        settings: ['read'],
        clients: ['read', 'update']
      }
    },
    {
      role: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to properties',
      color: 'bg-gray-500',
      permissions: {
        properties: ['read'],
        users: [],
        analytics: [],
        settings: [],
        clients: []
      }
    }
  ]

  // Sample Users Data
  const sampleUsers: User[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'super_admin',
      status: 'active',
      avatar: 'JS',
      phone: '+1 (555) 123-4567',
      joinedDate: '2023-01-15',
      lastLogin: '2024-01-30T10:30:00',
      propertiesManaged: 45,
      totalSales: '$2,450,000',
      department: 'Administration',
      location: 'New York',
      permissions: [],
      isVerified: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'admin',
      status: 'active',
      avatar: 'SJ',
      phone: '+1 (555) 234-5678',
      joinedDate: '2023-02-20',
      lastLogin: '2024-01-30T09:15:00',
      propertiesManaged: 32,
      totalSales: '$1,890,000',
      department: 'Sales',
      location: 'Los Angeles',
      permissions: [],
      isVerified: true
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      role: 'agent',
      status: 'active',
      avatar: 'MD',
      phone: '+1 (555) 345-6789',
      joinedDate: '2023-03-10',
      lastLogin: '2024-01-29T16:45:00',
      propertiesManaged: 28,
      totalSales: '$1,420,000',
      department: 'Sales',
      location: 'Miami',
      permissions: [],
      isVerified: true
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily.wilson@company.com',
      role: 'agent',
      status: 'active',
      avatar: 'EW',
      phone: '+1 (555) 456-7890',
      joinedDate: '2023-04-05',
      lastLogin: '2024-01-30T08:20:00',
      propertiesManaged: 22,
      totalSales: '$980,000',
      department: 'Sales',
      location: 'Chicago',
      permissions: [],
      isVerified: true
    },
    {
      id: 5,
      name: 'Robert Chen',
      email: 'robert.chen@company.com',
      role: 'manager',
      status: 'active',
      avatar: 'RC',
      phone: '+1 (555) 567-8901',
      joinedDate: '2023-01-30',
      lastLogin: '2024-01-29T14:30:00',
      propertiesManaged: 38,
      totalSales: '$2,100,000',
      department: 'Operations',
      location: 'San Francisco',
      permissions: [],
      isVerified: true
    },
    {
      id: 6,
      name: 'Lisa Martinez',
      email: 'lisa.martinez@client.com',
      role: 'client',
      status: 'active',
      avatar: 'LM',
      phone: '+1 (555) 678-9012',
      joinedDate: '2023-12-01',
      lastLogin: '2024-01-28T12:00:00',
      propertiesManaged: 0,
      totalSales: '$0',
      department: 'Client',
      location: 'Dallas',
      permissions: [],
      isVerified: false
    }
  ]

  // Initialize data
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setUsers(sampleUsers)
      setFilteredUsers(sampleUsers)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.department.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role)
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status)
    }

    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(user => user.department === filters.department)
    }

    // Sort
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'role':
        filtered.sort((a, b) => a.role.localeCompare(b.role))
        break
      case 'sales':
        filtered.sort((a, b) => 
          parseFloat(b.totalSales.replace(/[^0-9.-]+/g, '')) - 
          parseFloat(a.totalSales.replace(/[^0-9.-]+/g, ''))
        )
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime())
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, filters])

  // Filter options
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...roleDefinitions.map(role => ({ value: role.role, label: role.name }))
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ]

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Administration', label: 'Administration' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Client', label: 'Client' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'role', label: 'Role' },
    { value: 'sales', label: 'Top Sales' }
  ]

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all',
      department: 'all',
      location: 'all',
      sortBy: 'newest'
    })
  }

  const getRoleInfo = (role: UserRole) => {
    return roleDefinitions.find(r => r.role === role) || roleDefinitions[roleDefinitions.length - 1]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === currentUsers.length 
        ? [] 
        : currentUsers.map(user => user.id)
    )
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
              User Management
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              Manage users, roles, and permissions. Control access levels and monitor user activity across your real estate platform.
            </p>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>{filteredUsers.length} Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <HomeIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>{roleDefinitions.length} Roles</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="dark" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 border"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white hover:bg-gray-50 text-[var(--primary)] border-0"
              icon={<PlusIcon className="w-4 h-4" />}
            >
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mx-6 mb-8">
        {roleDefinitions.map((role) => {
          const count = users.filter(user => user.role === role.role).length
          return (
            <Card key={role.role} className="text-center hover:scale-105 transition-transform duration-300">
              <div className={`w-12 h-12 ${role.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                {role.name.charAt(0)}
              </div>
              <div className={`text-2xl font-bold text-gray-900 ${MontserratFont.className}`}>
                {count}
              </div>
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                {role.name}
              </div>
            </Card>
          )
        })}
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

            {/* Search and Sort */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Input
                  type="search"
                  placeholder="Search by name, email, or department..."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                options={roleOptions}
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                placeholder="Filter by role"
              />
              
              <Select
                options={statusOptions}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                placeholder="Filter by status"
              />
              
              <Select
                options={departmentOptions}
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                placeholder="Filter by department"
              />
              
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20"
                  />
                  <span className={`text-gray-700 ${popinsFont['500'].className}`}>Verified Only</span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="mx-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`text-blue-800 font-medium ${popinsFont['600'].className}`}>
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">Export</Button>
              <Button variant="ghost" size="sm">Deactivate</Button>
              <Button variant="ghost" size="sm">Delete</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results Header */}
      <div className="mx-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <p className={`text-gray-600 ${popinsFont['500'].className}`}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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

      {/* Users Table */}
      <div className="mx-6 mb-8">
        <Card variant="elevated" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                      onChange={selectAllUsers}
                      className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20"
                    />
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${popinsFont['600'].className}`}>
                    User
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${popinsFont['600'].className}`}>
                    Role & Department
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${popinsFont['600'].className}`}>
                    Status & Activity
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${popinsFont['600'].className}`}>
                    Performance
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${popinsFont['600'].className}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role)
                  return (
                    <tr 
                      key={user.id} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${roleInfo.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg`}>
                            {user.avatar}
                          </div>
                          <div>
                            <div className={`text-sm font-medium text-gray-900 ${popinsFont['600'].className}`}>
                              {user.name}
                              {user.isVerified && (
                                <span className="ml-2 text-emerald-500">✓</span>
                              )}
                            </div>
                            <div className={`text-sm text-gray-500 ${popinsFont['400'].className}`}>
                              {user.email}
                            </div>
                            <div className={`text-xs text-gray-400 ${popinsFont['400'].className}`}>
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color} text-white`}>
                            {roleInfo.name}
                          </span>
                          <div className={`text-sm text-gray-600 mt-1 ${popinsFont['500'].className}`}>
                            {user.department}
                          </div>
                          <div className={`text-xs text-gray-400 ${popinsFont['400'].className}`}>
                            {user.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                          <div className={`text-xs text-gray-500 mt-1 ${popinsFont['400'].className}`}>
                            Joined: {new Date(user.joinedDate).toLocaleDateString()}
                          </div>
                          <div className={`text-xs text-gray-400 ${popinsFont['400'].className}`}>
                            Last: {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className={`text-sm font-medium text-gray-900 ${popinsFont['600'].className}`}>
                            {user.totalSales}
                          </div>
                          <div className={`text-xs text-gray-600 ${popinsFont['400'].className}`}>
                            {user.propertiesManaged} properties
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
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
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mx-6 mb-8">
          <Card className="px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                Page {currentPage} of {totalPages} ({filteredUsers.length} total users)
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ←
                </button>

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

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  →
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Last
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <button className="w-14 h-14 bg-gradient-to-r from-[var(--primary)] to-amber-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default UsersPage