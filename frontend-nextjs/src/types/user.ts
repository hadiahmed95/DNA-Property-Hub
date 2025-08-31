export type UserType = 'super_admin' | 'admin' | 'agent' | 'manager' | 'client' | 'viewer'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: number
  name: string
  email: string
  type: UserType
  status: UserStatus
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
