import { Role } from "./role"

export type UserType = 'admin' | 'agent'
export type UserStatus = 'active' | 'inactive'

interface UserProfile {
  id?: number
  user_id?: number
  role_id: number | string
  department: string
  job_title: string
  employee_id?: string
  joining_date: string
  reporting_to_user_id: number | string
  skill_experties?: string
  created_at?: string
  updated_at?: string

  role?: Role | null
}

interface UserContact {
  id?: number
  user_id?: number
  phone_no: string
  address_line_1: string
  city: string
  state: string
  zipcode: string
  country: string
  emergency_contact_name: string
  emergency_contact_phone: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id?: number
  name: string
  email: string
  password: string
  email_verified_at?: string | null
  type: UserType
  status: UserStatus
  created_at?: string
  updated_at?: string
  profile?: UserProfile | null
  contact?: UserContact | null
}