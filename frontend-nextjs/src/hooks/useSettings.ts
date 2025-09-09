import { useState, useEffect } from 'react'
import settingsService, { UserSettings } from '@/services/settings.service'

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await settingsService.getUserSettings()
      setSettings(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (category: string, settingsData: any) => {
    try {
      setError(null)
      await settingsService.updateSettings(category, settingsData)
      
      // Update local state
      if (settings) {
        setSettings({
          ...settings,
          [category]: {
            ...settings[category as keyof UserSettings],
            ...settingsData
          }
        })
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const changePassword = async (passwordData: any) => {
    try {
      setError(null)
      await settingsService.changePassword(passwordData)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      setError(null)
      const avatarUrl = await settingsService.uploadAvatar(file)
      
      // Update local state
      if (settings) {
        setSettings({
          ...settings,
          profile: {
            ...settings.profile,
            avatar: avatarUrl
          }
        })
      }
      
      return avatarUrl
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
    changePassword,
    uploadAvatar
  }
}