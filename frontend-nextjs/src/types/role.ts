export interface Role {
  id: string
  name: string
  description: string
  color: string
  permissions: Permission[]
  user_count: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Permission {
    role_id: string
    permission: string
}
