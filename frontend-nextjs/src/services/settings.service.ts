import api from './api'

export interface UserSettings {
  profile: {
    name: string
    email: string
    avatar: string | null
    title: string
    department: string
    phone: string
    timezone: string
    language: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    weeklyReports: boolean
    propertyAlerts: boolean
    taskReminders: boolean
  }
  security: {
    twoFactorAuth: boolean
    loginAlerts: boolean
    passwordChangeRequired: boolean
    sessionTimeout: number
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    dateFormat: string
    timezone: string
    currency: string
    itemsPerPage: number
  }
  privacy: {
    profileVisibility: 'public' | 'team' | 'private'
    showOnlineStatus: boolean
    allowDirectMessages: boolean
    shareAnalytics: boolean
  }
}

export interface PasswordChangeData {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface AccountInfo {
  account_created: string
  last_login: string
  total_logins: number
  account_status: string
  storage_used: {
    documents: string
    images: string
    total_used: string
    total_allowed: string
    percentage_used: number
  }
  active_sessions: Array<{
    id: number
    device: string
    location: string
    last_activity: string
    is_current: boolean
  }>
}

class SettingsService {
  /**
   * Get user settings
   */
  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await api.get('/settings')
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch settings')
    }
  }

  /**
   * Update settings for a specific category
   */
  async updateSettings(category: string, settings: any): Promise<void> {
    try {
      await api.post('/settings/update', {
        category,
        settings
      })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update settings')
    }
  }

  /**
   * Change user password
   */
  async changePassword(passwordData: PasswordChangeData): Promise<void> {
    try {
      await api.post('/settings/change-password', passwordData)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password')
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await api.post('/settings/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data.data.avatar_url
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload avatar')
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<AccountInfo> {
    try {
      const response = await api.get('/settings/account-info')
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch account info')
    }
  }

  /**
   * Export account data
   */
  async exportAccountData(): Promise<void> {
    try {
      const response = await api.get('/settings/export-data', {
        responseType: 'blob'
      })

      // Create download link
      const blob = new Blob([response.data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `account_data_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to export account data')
    }
  }

  /**
   * Revoke user session
   */
  async revokeSession(sessionId: number): Promise<void> {
    try {
      await api.post(`/settings/revoke-session/${sessionId}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to revoke session')
    }
  }

  /**
   * Enable two-factor authentication
   */
  async enableTwoFactorAuth(): Promise<{ qr_code: string; backup_codes: string[] }> {
    try {
      const response = await api.post('/settings/enable-2fa')
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enable 2FA')
    }
  }

  /**
   * Confirm two-factor authentication setup
   */
  async confirmTwoFactorAuth(code: string): Promise<void> {
    try {
      await api.post('/settings/confirm-2fa', { code })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to confirm 2FA')
    }
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactorAuth(password: string): Promise<void> {
    try {
      await api.post('/settings/disable-2fa', { password })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to disable 2FA')
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<any> {
    try {
      const response = await api.get('/settings/notifications')
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notification preferences')
    }
  }

  /**
   * Test notification settings
   */
  async testNotification(type: 'email' | 'sms' | 'push'): Promise<void> {
    try {
      await api.post('/settings/test-notification', { type })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send test notification')
    }
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(settings: any): Promise<void> {
    try {
      await api.post('/settings/privacy', settings)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update privacy settings')
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<void> {
    try {
      await api.post('/settings/delete-account', { password })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete account')
    }
  }

  /**
   * Get API keys for user
   */
  async getApiKeys(): Promise<any[]> {
    try {
      const response = await api.get('/settings/api-keys')
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch API keys')
    }
  }

  /**
   * Generate new API key
   */
  async generateApiKey(name: string, permissions: string[]): Promise<{ key: string; id: number }> {
    try {
      const response = await api.post('/settings/api-keys', {
        name,
        permissions
      })
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate API key')
    }
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(keyId: number): Promise<void> {
    try {
      await api.delete(`/settings/api-keys/${keyId}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to revoke API key')
    }
  }
}

export default new SettingsService()