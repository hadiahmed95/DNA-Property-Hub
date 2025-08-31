'use client'

import React, { useState, useEffect } from 'react'
import RolesService from '@/services/roles.service'
import { toast } from 'react-hot-toast'
import Card from '@/components/card'
import Button from '@/components/button'
import Input from '@/components/form/input'
import { 
  EditIcon,
  TrashIcon,
  PlusIcon,
  UsersIcon,
  SettingsIcon,
} from '@/components/icons'
import { MontserratFont, popinsFont } from '../../../../fonts'
import { Role } from '@/types/role'

// Types
interface Permission {
  id: string
  name: string
  description: string
  category: 'properties' | 'users' | 'blogs' | 'pages'
}

interface RoleForm extends Omit<Role, 'permissions'> {
  permissions: string[]
}

const RoleManagementPage = () => {
  const [selectedRole, setSelectedRole] = useState<RoleForm | null>(null)
  const [showAddRole, setShowAddRole] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleForm | null>(null)
  const [roles, setRoles] = useState<RoleForm[]>([])
  const [newRole, setNewRole] = useState<Partial<RoleForm>>({
    name: '',
    description: '',
    color: '#2b7fff',
    permissions: []
  })
  const [loading, setLoading] = useState(false)

  // Available Permissions
  const availablePermissions: Permission[] = [
    // Properties
    { id: 'properties.create', name: 'Create Properties', description: 'Add new property listings', category: 'properties' },
    { id: 'properties.read', name: 'View Properties', description: 'View property listings and details', category: 'properties' },
    { id: 'properties.update', name: 'Edit Properties', description: 'Modify property information', category: 'properties' },
    { id: 'properties.delete', name: 'Delete Properties', description: 'Remove property listings', category: 'properties' },

    // Users
    { id: 'users.create', name: 'Create Users', description: 'Add new user accounts', category: 'users' },
    { id: 'users.read', name: 'View Users', description: 'View user profiles and information', category: 'users' },
    { id: 'users.update', name: 'Edit Users', description: 'Modify user accounts and profiles', category: 'users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'users' },

    // Users
    { id: 'blogs.create', name: 'Create Blogs', description: 'Add new blog posts', category: 'blogs' },
    { id: 'blogs.read', name: 'View Blogs', description: 'View blog posts and details', category: 'blogs' },
    { id: 'blogs.update', name: 'Edit Blogs', description: 'Modify blog posts', category: 'blogs' },
    { id: 'blogs.delete', name: 'Delete Blogs', description: 'Remove blog posts', category: 'blogs' },

    // Pages
    { id: 'pages.read', name: 'View Pages', description: 'Access page information', category: 'pages' },
    { id: 'pages.update', name: 'Edit Pages', description: 'Modify page content', category: 'pages' },
  ]

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const data: Role[] = await RolesService.getRoles()
      console.log('data', data);
      setRoles(data.map((d) => ({
        ...d,
        permissions: d.permissions.map((p) => p.permission),
      })))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'properties':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'users':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'blogs':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pages':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const groupPermissionsByCategory = () => {
    return availablePermissions.reduce((groups, permission) => {
      if (!groups[permission.category]) {
        groups[permission.category] = []
      }
      groups[permission.category].push(permission)
      return groups
    }, {} as Record<string, Permission[]>)
  }

  const togglePermission = (permissionId: string, rolePermissions: string[]) => {
    return rolePermissions.includes(permissionId)
      ? rolePermissions.filter(id => id !== permissionId)
      : [...rolePermissions, permissionId]
  }

  const handleSaveRole = async () => {
    try {
      setLoading(true)
      if (editingRole) {
        await RolesService.updateRole(editingRole.id, editingRole)
        toast.success('Role updated successfully')
      } else if (newRole.name && newRole.description) {
        await RolesService.createRole(newRole as RoleForm)
        toast.success('Role created successfully')
      }
      fetchRoles()
      setEditingRole(null)
      setShowAddRole(false)
      setNewRole({ name: '', description: '', color: '#2b7fff', permissions: [] })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save role')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return

    try {
      setLoading(true)
      await RolesService.deleteRole(roleId)
      toast.success('Role deleted successfully')
      fetchRoles()
      if (selectedRole?.id === roleId) {
        setSelectedRole(null)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete role')
    } finally {
      setLoading(false)
    }
  }

  const colorOptions = [
    '#ad46ff', '#fa2c37', '#2b7fff', '#00c950', 
    '#fe9900', '#f6339a', '#615fff', '#00bba7'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-[var(--secondary)] via-gray-700 to-gray-800 rounded-3xl mx-6 mt-6 mb-8 p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white mb-6 lg:mb-0">
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${MontserratFont.className}`}>
              Role Management
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              Define roles and permissions to control user access levels. Manage what users can see and do within the system.
            </p>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>{roles.length} Roles</span>
              </div>
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-5 h-5" />
                <span className={`${popinsFont['500'].className}`}>{availablePermissions.length} Permissions</span>
              </div>
            </div>
          </div>
          <div className="text-white">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-center border border-white/20">
              <div className="text-5xl">🛡️</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mx-6 mb-8">
        {/* Roles List */}
        <div className="xl:col-span-1">
          <Card variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold text-gray-900 ${MontserratFont.className}`}>
                System Roles
              </h2>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddRole(true)}
                icon={<PlusIcon className="w-4 h-4" />}
              >
                Add Role
              </Button>
            </div>

            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedRole?.id === role.id
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold`}
                      style={{ backgroundColor: role.color }}>
                        {role.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-semibold text-gray-900 ${popinsFont['600'].className}`}>
                          {role.name}
                          {role.is_default && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                          {role.user_count} user{role.user_count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingRole(role)
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      {!role.is_default && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteRole(role.id)
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={`text-sm text-gray-600 mt-2 ${popinsFont['400'].className}`}>
                    {role.description}
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${popinsFont['400'].className}`}>
                    {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Role Details & Permissions */}
        <div className="xl:col-span-2">
          {selectedRole ? (
            <Card variant="elevated">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${selectedRole.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
                    {selectedRole.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold text-gray-900 ${MontserratFont.className}`}>
                      {selectedRole.name}
                    </h2>
                    <p className={`text-gray-600 ${popinsFont['400'].className}`}>
                      {selectedRole.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                    {selectedRole.user_count} users
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingRole(selectedRole)}
                  >
                    Edit Role
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(groupPermissionsByCategory()).map(([category, permissions]) => (
                  <div key={category}>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(category)}`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <div className={`text-sm text-gray-500 ${popinsFont['400'].className}`}>
                        {permissions.filter(p => selectedRole.permissions.includes(p.id)).length} of {permissions.length} permissions
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => {
                        const hasPermission = selectedRole.permissions.includes(permission.id)
                        return (
                          <div
                            key={permission.id}
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              hasPermission
                                ? 'border-emerald-200 bg-emerald-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                                  hasPermission
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-gray-300'
                                }`}
                              >
                                {hasPermission && (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium text-gray-900 ${popinsFont['600'].className}`}>
                                  {permission.name}
                                </div>
                                <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                                  {permission.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16" variant="glass">
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Select a Role
              </h3>
              <p className={`text-gray-600 mb-8 ${popinsFont['400'].className}`}>
                Choose a role from the list to view its permissions and details.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Role Modal */}
      {(showAddRole || editingRole) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold text-gray-900 ${MontserratFont.className}`}>
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h2>
              <button
                onClick={() => {
                  setShowAddRole(false)
                  setEditingRole(null)
                  setNewRole({ name: '', description: '', color: 'bg-blue-500', permissions: [] })
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Role Name *"
                  placeholder="e.g., Senior Agent"
                  value={editingRole ? editingRole.name : newRole.name}
                  onChange={(e) => {
                    if (editingRole) {
                      setEditingRole({ ...editingRole, name: e.target.value })
                    } else {
                      setNewRole({ ...newRole, name: e.target.value })
                    }
                  }}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          if (editingRole) {
                            setEditingRole({ ...editingRole, color })
                          } else {
                            setNewRole({ ...newRole, color })
                          }
                        }}
                        className={`w-8 h-8 rounded-lg ring-2 transition-all duration-200 ${
                          (editingRole ? editingRole.color : newRole.color) === color
                            ? 'ring-[var(--secondary)] scale-110'
                            : 'ring-gray-100'
                        }`}
                        style={{
                          background: color ?? 'white'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the role and its responsibilities..."
                  value={(editingRole ? editingRole.description : newRole.description) ?? ''}
                  onChange={(e) => {
                    if (editingRole) {
                      setEditingRole({ ...editingRole, description: e.target.value })
                    } else {
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all duration-200 resize-none"
                />
              </div>

              {/* Permissions */}
              <div>
                <h3 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                  Permissions
                </h3>
                
                <div className="space-y-6">
                  {Object.entries(groupPermissionsByCategory()).map(([category, permissions]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(category)}`}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentPermissions = editingRole ? editingRole.permissions : newRole.permissions || []
                            const categoryPermissionIds = permissions.map(p => p.id)
                            const hasAll = categoryPermissionIds.every(id => currentPermissions.includes(id))
                            
                            let newPermissions
                            if (hasAll) {
                              newPermissions = currentPermissions.filter(id => !categoryPermissionIds.includes(id))
                            } else {
                              newPermissions = [...new Set([...currentPermissions, ...categoryPermissionIds])]
                            }

                            if (editingRole) {
                              setEditingRole({ ...editingRole, permissions: newPermissions })
                            } else {
                              setNewRole({ ...newRole, permissions: newPermissions })
                            }
                          }}
                        >
                          {permissions.every(p => (editingRole ? editingRole.permissions : newRole.permissions || []).includes(p.id))
                            ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => {
                          const currentPermissions = editingRole ? editingRole.permissions : newRole.permissions || []
                          const hasPermission = currentPermissions.includes(permission.id)
                          
                          return (
                            <label
                              key={permission.id}
                              className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="relative mt-1">
                                <input
                                  type="checkbox"
                                  checked={hasPermission}
                                  onChange={() => {
                                    const newPermissions = togglePermission(permission.id, currentPermissions)
                                    if (editingRole) {
                                      setEditingRole({ ...editingRole, permissions: newPermissions })
                                    } else {
                                      setNewRole({ ...newRole, permissions: newPermissions })
                                    }
                                  }}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                                    hasPermission
                                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                                      : 'border-gray-300 hover:border-[var(--primary)]'
                                  }`}
                                >
                                  {hasPermission && (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium text-gray-900 ${popinsFont['600'].className}`}>
                                  {permission.name}
                                </div>
                                <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                                  {permission.description}
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                  {(editingRole ? editingRole.permissions : newRole.permissions || []).length} permissions selected
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowAddRole(false)
                      setEditingRole(null)
                      setNewRole({ name: '', description: '', color: 'bg-blue-500', permissions: [] })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveRole}
                    disabled={!(editingRole ? editingRole.name && editingRole.description : newRole.name && newRole.description)}
                  >
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default RoleManagementPage