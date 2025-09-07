import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api/v1'

interface FilterGroup {
  id: number
  name: string
  slug: string
  is_multiple: boolean
  is_required: boolean
  filter_values?: FilterValue[]
}

interface FilterValue {
  id: number
  filter_group_id: number
  value: string
  label: string
  color?: string
  icon?: string
}

class FilterService {
  async getFilterGroups(page = 'properties') {
    try {
      const response = await axios.get(`${API_BASE}/public/filters/groups?page=${page}`)
      return response.data
    } catch (error) {
      console.error('❌ Filter groups error:', error)
      throw error
    }
  }

  async getFilterValuesByGroup(groupId: number) {
    try {
      const response = await axios.get(`${API_BASE}/public/filters/groups/${groupId}/values`)
      return response.data
    } catch (error) {
      console.error('❌ Filter values error:', error)
      throw error
    }
  }

  async getAllFiltersForForm() {
    try {
      // Step 1: Get all filter groups
      const groupsResponse = await this.getFilterGroups('properties')
      
      // Handle different response formats
      let groups: FilterGroup[] = []
      
      if (groupsResponse.success && groupsResponse.data) {
        // Laravel API format: { success: true, data: [...] }
        groups = groupsResponse.data
      } else if (Array.isArray(groupsResponse)) {
        // Direct array format: [...]
        groups = groupsResponse
      } else if (groupsResponse.data && Array.isArray(groupsResponse.data)) {
        // Nested data format: { data: [...] }
        groups = groupsResponse.data
      } else {
        console.error('❌ Unexpected groups response format:', groupsResponse)
        return {
          success: false,
          error: 'Invalid groups response format'
        }
      }

      if (groups.length === 0) {
        return {
          success: false,
          error: 'No filter groups found'
        }
      }

      // Step 2: Get values for each group
      const filtersMap: Record<string, FilterValue[]> = {}
      
      for (const group of groups) {
        try {
          const valuesResponse = await this.getFilterValuesByGroup(group.id)
          
          // Handle different response formats for values
          let values: FilterValue[] = []
          
          if (valuesResponse.success && valuesResponse.data) {
            values = valuesResponse.data
          } else if (Array.isArray(valuesResponse)) {
            values = valuesResponse
          } else if (valuesResponse.data && Array.isArray(valuesResponse.data)) {
            values = valuesResponse.data
          }
          
          filtersMap[group.slug] = values
        } catch (error) {
          console.error(`❌ Failed to load values for group ${group.slug}:`, error)
          filtersMap[group.slug] = [] // Set empty array as fallback
        }
      }
      
      const result = {
        success: true,
        data: {
          groups,
          values: filtersMap
        }
      }
      
      return result
      
    } catch (error) {
      console.error('💥 getAllFiltersForForm failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load filters'
      }
    }
  }
}

export default new FilterService()
