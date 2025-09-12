export interface Property {
  id: number
  title: string
  slug?: string
  location: {
    address: string
    city: string
    state: string
    full_address: string
  }
  price: {
    value: number
    formatted: string
    type: string
  }
  bedrooms: number
  bathrooms: number
  square_footage: number
  media: {
    images: string[]
    primary_image?: string
  }
  status: {
    is_active: boolean
    is_featured: boolean
  }
  agent: {
    name: string
  }
  filters?: any[]
}