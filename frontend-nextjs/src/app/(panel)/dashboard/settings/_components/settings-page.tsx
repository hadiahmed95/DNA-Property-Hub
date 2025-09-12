import React, { useState, useEffect } from 'react'
import { 
  SettingsIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  DatabaseIcon,
  PaletteIcon,
  GlobeIcon,
  SaveIcon,
  UploadIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  XIcon,
  EditIcon
} from 'lucide-react'
import { useAuth } from '@/contexts/auth.context'

// Mock services - In real app, these would be actual API calls
const settingsService = {
  getUserSettings: async () => ({
    profile: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: null,
      title: 'Senior Real Estate Agent',
      department: 'Sales',
      phone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      weeklyReports: true,
      propertyAlerts: true,
      taskReminders: true
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      passwordChangeRequired: false,
      sessionTimeout: 30
    },
    display: {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'America/New_York',
      currency: 'USD',
      itemsPerPage: 25
    },
    privacy: {
      profileVisibility: 'team',
      showOnlineStatus: true,
      allowDirectMessages: true,
      shareAnalytics: false
    }
  }),
  
  updateSettings: async (section: any, data: any) => {
    console.log('Updating settings:', section, data)
    return { success: true }
  },
  
  changePassword: async (data: any) => {
    console.log('Changing password:', data)
    return { success: true }
  }
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<any>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const { user } = useAuth()

  console.log('user', user)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // try {
    //   const data = await settingsService.getUserSettings()
    //   setSettings(data)
    // } catch (error) {
    //   console.error('Failed to load settings:', error)
    // } finally {
    //   setLoading(false)
    // }
  }

  const handleSettingChange = (section: any, key: any, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = async (section: any) => {
    setSaving(true)
    try {
      await settingsService.updateSettings(section, settings[section])
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    setSaving(true)
    try {
      await settingsService.changePassword(passwordData)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error('Failed to change password:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if(e.target?.result) {
          setAvatarPreview(e.target.result)
          handleSettingChange('profile', 'avatar', file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'display', label: 'Display', icon: PaletteIcon },
    { id: 'privacy', label: 'Privacy', icon: GlobeIcon },
    { id: 'system', label: 'System', icon: DatabaseIcon }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl mx-6 mt-6 mb-8 p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white mb-6 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Settings
            </h1>
            <p className="text-xl text-white/90 mb-6 max-w-2xl">
              Customize your dashboard experience and manage your account preferences.
            </p>
          </div>
          <div className="text-white text-6xl opacity-20">
            <SettingsIcon size={120} />
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mx-6 mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
          <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
          <span className="text-green-800">Settings saved successfully!</span>
        </div>
      )}

      <div className="mx-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Menu</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                  <p className="text-gray-600">Update your personal information and profile details.</p>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                      ) : (
                        settings?.profile?.name?.split(' ').map((n: any) => n[0]).join('') || 'JD'
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <UploadIcon className="h-4 w-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
                    <p className="text-gray-600">Upload a new avatar for your profile</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={settings?.profile?.name || ''}
                      onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings?.profile?.email || ''}
                      onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={settings?.profile?.title || ''}
                      onChange={(e) => handleSettingChange('profile', 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={settings?.profile?.department || ''}
                      onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="sales">Sales</option>
                      <option value="marketing">Marketing</option>
                      <option value="operations">Operations</option>
                      <option value="administration">Administration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={settings?.profile?.phone || ''}
                      onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings?.profile?.timezone || ''}
                      onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('profile')}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                  <p className="text-gray-600">Choose how you want to be notified about important updates.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', description: 'Get urgent notifications via text' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Subscribe to newsletters and promotions' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance reports' },
                    { key: 'propertyAlerts', label: 'Property Alerts', description: 'New property listings notifications' },
                    { key: 'taskReminders', label: 'Task Reminders', description: 'Reminders for pending tasks' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.notifications?.[setting.key] || false}
                          onChange={(e) => handleSettingChange('notifications', setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('notifications')}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-gray-600">Manage your account security and password settings.</p>
                </div>

                {/* Change Password */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>

                {/* Security Options */}
                <div className="space-y-6">
                  {[
                    { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security', recommended: true },
                    { key: 'loginAlerts', label: 'Login Alerts', description: 'Get notified of new login attempts' },
                    { key: 'passwordChangeRequired', label: 'Periodic Password Change', description: 'Require password change every 90 days' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{setting.label}</h4>
                          {setting.recommended && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Recommended</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.security?.[setting.key] || false}
                          onChange={(e) => handleSettingChange('security', setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('security')}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Display Preferences</h2>
                  <p className="text-gray-600">Customize how information is displayed in your dashboard.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={settings?.display?.theme || 'light'}
                      onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={settings?.display?.dateFormat || 'MM/DD/YYYY'}
                      onChange={(e) => handleSettingChange('display', 'dateFormat', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings?.display?.currency || 'USD'}
                      onChange={(e) => handleSettingChange('display', 'currency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items per Page</label>
                    <select
                      value={settings?.display?.itemsPerPage || 25}
                      onChange={(e) => handleSettingChange('display', 'itemsPerPage', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('display')}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Settings</h2>
                  <p className="text-gray-600">Control your privacy and data sharing preferences.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                      value={settings?.privacy?.profileVisibility || 'team'}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="public">Public</option>
                      <option value="team">Team Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  {[
                    { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others see when you are online' },
                    { key: 'allowDirectMessages', label: 'Allow Direct Messages', description: 'Allow team members to send you direct messages' },
                    { key: 'shareAnalytics', label: 'Share Analytics Data', description: 'Help improve the platform by sharing anonymous usage data' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.privacy?.[setting.key] || false}
                          onChange={(e) => handleSettingChange('privacy', setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('privacy')}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">System Information</h2>
                  <p className="text-gray-600">View system information and manage data settings.</p>
                </div>

                {/* System Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Created:</span>
                        <span className="font-medium">Jan 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Login:</span>
                        <span className="font-medium">Today, 10:30 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Logins:</span>
                        <span className="font-medium">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Status:</span>
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Storage Usage</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Documents:</span>
                        <span className="font-medium">234 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Images:</span>
                        <span className="font-medium">1.2 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Used:</span>
                        <span className="font-medium">1.4 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '28%'}}></div>
                      </div>
                      <p className="text-xs text-gray-500">28% of 5 GB used</p>
                    </div>
                  </div>
                </div>

                {/* Data Management */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-semibold text-red-900 mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">Export Account Data</h4>
                        <p className="text-sm text-red-700">Download a copy of all your account data</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Export Data
                      </button>
                    </div>
                    <hr className="border-red-200" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>

                {/* Session Management */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-600">Chrome on Windows • Lahore, Pakistan</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Active Now</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium">Mobile Session</p>
                          <p className="text-sm text-gray-600">Safari on iPhone • 2 hours ago</p>
                        </div>
                      </div>
                      <button className="text-sm text-red-600 hover:text-red-800">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage