import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api/v1'

class PropertyService {
  private getAuthHeaders() {
    // Check multiple possible token storage locations
    const accessToken = localStorage.getItem('access_token')
    const authToken = localStorage.getItem('auth_token') 
    const token = localStorage.getItem('token')
    
    // Use the first available token
    const finalToken = accessToken || authToken || token
    
    if (!finalToken) {
      console.error('❌ No authentication token found!')
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    const headers = {
      'Authorization': `Bearer ${finalToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    return headers
  }

  // Test auth endpoint
  async testAuth() {
    try {
      const headers = this.getAuthHeaders()
      const response = await axios.get(`${API_BASE}/user`, { headers })
      return response.data
    } catch (error) {
      console.error('❌ Auth test failed:', error.response?.data || error.message)
      throw error
    }
  }

  // Create property with detailed error logging
  async createProperty(propertyData: any) {
    try {
      // Test auth first
      await this.testAuth()
      
      const headers = this.getAuthHeaders()
      const response = await axios.post(
        `${API_BASE}/properties`,
        propertyData,
        { headers }
      )
      
      return response.data
      
    } catch (error) {
      console.error('❌ Create property failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      })
      
      if (error.response?.status === 401) {
        console.error('🚨 Unauthorized! Token might be invalid or expired')
        // Clear potentially invalid token
        localStorage.removeItem('access_token')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token')
        
        return {
          success: false,
          error: 'Authentication failed. Please login again.'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create property'
      }
    }
  }

  async getProperties(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    const response = await axios.get(`${API_BASE}/public/properties?${params}`)
    return response.data
  }

  async getFeaturedProperties(limit = 6) {
    const response = await axios.get(`${API_BASE}/public/properties/featured?limit=${limit}`)
    return response.data
  }

  async searchProperties(query: string, filters = {}) {
    const params = new URLSearchParams({ q: query })
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await axios.get(`${API_BASE}/public/properties/search?${params}`)
    return response.data
  }

  async getPropertyById(id: number) {
    const response = await axios.get(`${API_BASE}/public/properties/${id}`)
    return response.data
  }

  async getPropertyFilters() {
    const response = await axios.get(`${API_BASE}/public/properties/filters`)
    return response.data
  }

  async updateProperty(id: number, propertyData: any) {
    const response = await axios.put(
      `${API_BASE}/properties/${id}`,
      propertyData,
      { headers: this.getAuthHeaders() }
    )
    return response.data
  }

  // FIXED: Properly handle all filter parameters including search
  async getMyProperties(page = 1, perPage = 10, extraParams = {}) {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString()
    })

    // Add all filter parameters properly
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    const response = await axios.get(
        `${API_BASE}/properties/my-properties?${params}`,
        { headers: this.getAuthHeaders() }
    )
    return response.data
  }

  async deleteProperty(id: number) {
    const response = await axios.delete(
      `${API_BASE}/properties/${id}`,
      { headers: this.getAuthHeaders() }
    )
    return response.data
  }

  async toggleFeatured(id: number) {
    const response = await axios.patch(
      `${API_BASE}/properties/${id}/toggle-featured`,
      {},
      { headers: this.getAuthHeaders() }
    )
    return response.data
  }
}

export default new PropertyService()
