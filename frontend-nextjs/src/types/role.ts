export interface Role {
  id: string
  name: string
  description: string
  color: string
  permissions: string[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  description: string
  category: 'properties' | 'users' | 'blogs' | 'pages'
}
