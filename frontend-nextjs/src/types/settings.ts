export interface SettingsFormData {
  profile: {
    name: string
    email: string
    title: string
    department: string
    phone: string
    timezone: string
    language: string
  }
  notifications: {
    [key: string]: boolean
  }
  security: {
    twoFactorAuth: boolean
    loginAlerts: boolean
    passwordChangeRequired: boolean
    sessionTimeout: number
  }
  display: {
    theme: string
    language: string
    dateFormat: string
    timezone: string
    currency: string
    itemsPerPage: number
  }
  privacy: {
    profileVisibility: string
    showOnlineStatus: boolean
    allowDirectMessages: boolean
    shareAnalytics: boolean
  }
}

export interface SettingsValidationErrors {
  [key: string]: string[]
}

export interface SettingsApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: SettingsValidationErrors
}
