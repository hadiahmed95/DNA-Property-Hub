import api from './api'
import { Role } from '@/types/role'

class RolesService {
  async getRoles() {
    const response = await api.get('/roles')
    return response.data
  }

  async getRole(id: string) {
    const response = await api.get(`/roles/${id}`)
    return response.data
  }

  async createRole(roleData: Partial<Role>) {
    const response = await api.post('/roles', roleData)
    return response.data
  }

  async updateRole(id: string, roleData: Partial<Role>) {
    const response = await api.put(`/roles/${id}`, roleData)
    return response.data
  }

  async deleteRole(id: string) {
    const response = await api.delete(`/roles/${id}`)
    return response.data
  }
}

export default new RolesService()
