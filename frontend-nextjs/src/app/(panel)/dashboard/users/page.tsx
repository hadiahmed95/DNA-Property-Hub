'use client'

import React, { useState, useEffect } from 'react'
import UsersService from '@/services/users.service'
import RolesService from '@/services/roles.service'
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
import toast from 'react-hot-toast'
import { Role } from '@/types/role'
import { useRouter } from 'next/navigation'

// User Types and Interfaces
export type UserRole = { name: string, color: string}

interface UserProfile {
  id: number
  user_id: number
  role_id: number
  department: string
  job_title: string
  employee_id: string
  joining_date: string
  reporting_to_user_id: number
  skill_experties: string
  created_at: string
  updated_at: string

  role: Role | null
}

interface UserContact {
  id: number
  user_id: number
  phone_no: string
  address_line_1: string
  city: string
  state: string
  zipcode: string
  country: string
  emergency_contact_name: string
  emergency_contact_phone: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  type: string
  status: string
  created_at: string
  updated_at: string
  profile: UserProfile | null
  contact: UserContact | null
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

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name' },
  { value: 'role', label: 'Role' },
  { value: 'sales', label: 'Sales' }
]

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
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

  const router = useRouter()

  // Initialize data
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [usersData, rolesData] = await Promise.all([
        UsersService.getUsers(),
        RolesService.getRoles()
      ])
      setUsers(usersData.data)
      setRoles(rolesData)
      setFilteredUsers(usersData.data)
    } catch (error: any) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  // Update roleOptions to use dynamic roles
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...roles.map(role => ({ 
      value: role.id,
      label: role.name
    }))
  ]

  const getRoleInfo = (roleType: string) => {
    const role = roles.find(r => r.name.toLowerCase() === roleType.toLowerCase())
    return role || roles[roles.length - 1]
  }

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.profile?.department.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // // Role filter
    // if (filters.role !== 'all') {
    //   filtered = filtered.filter(user => user.role === filters.role)
    // }

    // // Status filter
    // if (filters.status !== 'all') {
    //   filtered = filtered.filter(user => user.status === filters.status)
    // }

    // // Department filter
    // if (filters.department !== 'all') {
    //   filtered = filtered.filter(user => user.department === filters.department)
    // }

    // Sort
    // switch (filters.sortBy) {
    //   case 'name':
    //     filtered.sort((a, b) => a.name.localeCompare(b.name))
    //     break
    //   case 'role':
    //     filtered.sort((a, b) => a.role.localeCompare(b.role))
    //     break
    //   case 'sales':
    //     filtered.sort((a, b) => 
    //       parseFloat(b.totalSales.replace(/[^0-9.-]+/g, '')) - 
    //       parseFloat(a.totalSales.replace(/[^0-9.-]+/g, ''))
    //     )
    //     break
    //   case 'oldest':
    //     filtered.sort((a, b) => new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime())
    //     break
    //   default: // newest
    //     filtered.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
    // }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, filters])

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
                <span className={`${popinsFont['500'].className}`}>{roles.length} Roles</span>
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
              onClick={() => router.push('/dashboard/users/add')}
            >
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mx-6 mb-8">
        {roles.map((role) => {
          const count = users.filter(user => user.profile?.role?.name === role.name.toLowerCase()).length
          return (
            <Card key={role.id} className="text-center hover:scale-105 transition-transform duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3`}
                style={{background: role.color}}
              >
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
              
              {/* <Select
                options={departmentOptions}
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                placeholder="Filter by department"
              /> */}
              
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
                  const roleInfo = roles.find(r => Number(r.id) === user.profile?.role_id)
                  console.log('roleInfo', roleInfo)
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
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg`}
                          style={{background: roleInfo?.color ?? '#6a7282'}}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className={`text-sm font-medium text-gray-900 ${popinsFont['600'].className}`}>
                              {user.name}
                              {user.email_verified_at && (
                                <span className="ml-2 text-emerald-500">✓</span>
                              )}
                            </div>
                            <div className={`text-sm text-gray-500 ${popinsFont['400'].className}`}>
                              {user.email}
                            </div>
                            <div className={`text-xs text-gray-400 ${popinsFont['400'].className}`}>
                              {user.contact?.phone_no || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white`}
                            style={{background: roleInfo?.color || '#6a7282'}}
                          >
                            {roleInfo?.name || user.type}
                          </span>
                          <div className={`text-sm text-gray-600 mt-1 ${popinsFont['500'].className}`}>
                            {user.profile?.department || 'No department'}
                          </div>
                          <div className={`text-xs text-gray-400 ${popinsFont['400'].className}`}>
                            {user.contact?.city ? user.contact?.city + ',' : ''} {user.contact?.country || 'No location'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                          <div className={`text-xs text-gray-500 mt-1 ${popinsFont['400'].className}`}>
                            Joined: {user.profile?.joining_date ? new Date(user.profile.joining_date).toLocaleDateString() : new Date(user.created_at).toLocaleDateString()}
                          </div>
                          <div className={`text-xs text-gray-400 ${popinsFont['400'].className}`}>
                            ID: {user.profile?.employee_id || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className={`text-sm font-medium text-gray-900 ${popinsFont['600'].className}`}>
                            {user.profile?.job_title || 'No title'}
                          </div>
                          <div className={`text-xs text-gray-600 ${popinsFont['400'].className}`}>
                            {user.profile?.skill_experties || ''}
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