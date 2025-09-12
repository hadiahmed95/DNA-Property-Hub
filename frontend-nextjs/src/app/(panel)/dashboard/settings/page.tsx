'use client'

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
  AlertTriangleIcon,
  DownloadIcon,
  TrashIcon,
  LucideProps
} from 'lucide-react'
import { MontserratFont, popinsFont } from '../../../fonts'
import { useSettings } from '@/hooks/useSettings'
import settingsService, { UserSettings } from '@/services/settings.service'
import { SettingsCard } from '@/components/settings/SettingsCard'
import { ToggleSwitch } from '@/components/settings/ToggleSwitch'
import Button from '@/components/button'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import { useAuth } from '@/contexts/auth.context'

type Section = keyof UserSettings

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<Section | 'system'>('profile')
  const [saving, setSaving] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [formData, setFormData] = useState<UserSettings>({
    profile: {
    name: '',
    email: '',
    avatar: null,
    title: '',
    department: '',
    phone: '',
    timezone: '',
    language: ''
    }
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })

  const { settings, loading, error, updateSettings, changePassword, uploadAvatar } = useSettings()
  const { user } = useAuth()

  const loadAccountInfo = async () => {
    try {
      const info = await settingsService.getAccountInfo()
      setAccountInfo(info)
    } catch (error) {
      console.error('Failed to load account info:', error)
    }
  }

  const handleSettingChange = (section: keyof UserSettings, key: string, value: any) => {
    // This will be handled by the updateSettings function
    // We'll update local state optimistically
    setFormData(prev => ({...prev, [section]: prev ? {...prev[section], [key]: value} : {[key]: value}}))
  }

  const handleSaveSettings = async (section: string) => {
    console.log('section', section);
    setSaving(true)
    try {
      const sectionData = formData?.[section as keyof typeof formData]
      if (sectionData) {
        await updateSettings(section, sectionData)
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      alert('Passwords do not match')
      return
    }
    
    setSaving(true)
    try {
      await changePassword(passwordData)
      setPasswordData({ 
        current_password: '', 
        new_password: '', 
        new_password_confirmation: '' 
      })
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error('Failed to change password:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      try {
        await uploadAvatar(file)
      } catch (error) {
        console.error('Failed to upload avatar:', error)
        setAvatarPreview(null)
      }
    }
  }

  const handleExportData = async () => {
    try {
      await settingsService.exportAccountData()
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const tabs: {
    id: Section | 'system';
    label: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  }[] = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    // { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    // { id: 'display', label: 'Display', icon: PaletteIcon },
    // { id: 'privacy', label: 'Privacy', icon: GlobeIcon },
    // { id: 'system', label: 'System', icon: DatabaseIcon }
  ]

  useEffect(() => {
    if (activeTab === 'system') {
      loadAccountInfo()
    }
  }, [activeTab])

  useEffect(() => {
    setFormData({
      profile: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center">
            <AlertTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Error Loading Settings</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 rounded-3xl mx-6 mt-6 mb-8 p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white mb-6 lg:mb-0">
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${MontserratFont.className}`}>
              Settings
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
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

      <div className="mx-6 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${MontserratFont.className}`}>
              Settings Menu
            </h3>
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
          {/* Profile Settings */}
          {activeTab === 'profile' && settings && (
            <SettingsCard 
              title="Profile Settings" 
              description="Update your personal information and profile details."
            >
              <div className="space-y-8">
                {/* Avatar Upload */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                      {avatarPreview || settings.profile?.avatar ? (
                        <img 
                          src={avatarPreview || `${process.env.NEXT_PUBLIC_API_URL}/storage/${settings.profile?.avatar}` || ''} 
                          alt="Avatar" 
                          className="w-24 h-24 rounded-full object-cover" 
                        />
                      ) : (
                        settings.profile?.name?.split(' ').map(n => n[0]).join('') || 'User'
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <UploadIcon className="h-4 w-4" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold text-gray-900 ${MontserratFont.className}`}>
                      Profile Photo
                    </h3>
                    <p className={`text-gray-600 ${popinsFont['400'].className}`}>
                      Upload a new avatar for your profile
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData?.profile?.name}
                    onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData?.profile?.email}
                    onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                  />
                  <Input
                    label="Job Title"
                    value={formData?.profile?.title}
                    onChange={(e) => handleSettingChange('profile', 'title', e.target.value)}
                  />
                  <Select
                    label="Department"
                    options={[
                      { value: 'sales', label: 'Sales' },
                      { value: 'marketing', label: 'Marketing' },
                      { value: 'operations', label: 'Operations' },
                      { value: 'administration', label: 'Administration' }
                    ]}
                    value={formData?.profile?.department}
                    onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData?.profile?.phone}
                    onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                  />
                  <Select
                    label="Timezone"
                    options={[
                      { value: 'America/New_York', label: 'Eastern Time' },
                      { value: 'America/Chicago', label: 'Central Time' },
                      { value: 'America/Denver', label: 'Mountain Time' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time' }
                    ]}
                    value={formData?.profile?.timezone}
                    onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('profile')}
                    disabled={saving}
                    className="flex items-center"
                    icon={<SaveIcon className="h-4 w-4" />}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && settings && (
            <SettingsCard 
              title="Notification Preferences" 
              description="Choose how you want to be notified about important updates."
            >
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
                  <ToggleSwitch
                    key={setting.key}
                    checked={(settings.notifications as Record<string, any>)[setting.key] || false}
                    onChange={(checked) => handleSettingChange('notifications', setting.key, checked)}
                    label={setting.label}
                    description={setting.description}
                  />
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => handleSaveSettings('notifications')}
                  disabled={saving}
                  className="flex items-center"
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </SettingsCard>
          )}

          {/* Security */}
          {activeTab === 'security' && settings && (
            <div className="space-y-6">
              <SettingsCard 
                title="Change Password" 
                description="Update your account password for better security."
              >
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({...prev, current_password: e.target.value}))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="New Password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({...prev, new_password: e.target.value}))}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData(prev => ({...prev, new_password_confirmation: e.target.value}))}
                    />
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={saving || !passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation}
                    variant="primary"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </SettingsCard>

              <SettingsCard 
                title="Security Options" 
                description="Manage your account security preferences."
              >
                <div className="space-y-6">
                  {[
                    { 
                      key: 'twoFactorAuth', 
                      label: 'Two-Factor Authentication', 
                      description: 'Add an extra layer of security', 
                      recommended: true 
                    },
                    // { 
                    //   key: 'loginAlerts', 
                    //   label: 'Login Alerts', 
                    //   description: 'Get notified of new login attempts' 
                    // },
                    // { 
                    //   key: 'passwordChangeRequired', 
                    //   label: 'Periodic Password Change', 
                    //   description: 'Require password change every 90 days' 
                    // }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <div className="flex items-center">
                          <h4 className={`font-medium text-gray-900 ${popinsFont['600'].className}`}>
                            {setting.label}
                          </h4>
                          {setting.recommended && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className={`text-sm text-gray-600 ${popinsFont['400'].className}`}>
                          {setting.description}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={(settings.security as Record<string, any>)[setting.key] || false}
                        onChange={(checked) => handleSettingChange('security', setting.key, checked)}
                        label=""
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => handleSaveSettings('security')}
                    disabled={saving}
                    className="flex items-center"
                    icon={<SaveIcon className="h-4 w-4" />}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </SettingsCard>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && settings && (
            <SettingsCard 
              title="Display Preferences" 
              description="Customize how information is displayed in your dashboard."
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Theme"
                    options={[
                      { value: 'light', label: 'Light Mode' },
                      { value: 'dark', label: 'Dark Mode' },
                      { value: 'auto', label: 'Auto (System)' }
                    ]}
                    value={settings.display?.theme}
                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                  />
                  <Select
                    label="Date Format"
                    options={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                    ]}
                    value={settings.display?.dateFormat}
                    onChange={(e) => handleSettingChange('display', 'dateFormat', e.target.value)}
                  />
                  <Select
                    label="Currency"
                    options={[
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'GBP', label: 'GBP (£)' },
                      { value: 'CAD', label: 'CAD (C$)' }
                    ]}
                    value={settings.display?.currency}
                    onChange={(e) => handleSettingChange('display', 'currency', e.target.value)}
                  />
                  <Select
                    label="Items per Page"
                    options={[
                      { value: '10', label: '10' },
                      { value: '25', label: '25' },
                      { value: '50', label: '50' },
                      { value: '100', label: '100' }
                    ]}
                    value={settings.display?.itemsPerPage.toString()}
                    onChange={(e) => handleSettingChange('display', 'itemsPerPage', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('display')}
                    disabled={saving}
                    className="flex items-center"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && settings && (
            <SettingsCard 
              title="Privacy Settings" 
              description="Control your privacy and data sharing preferences."
            >
              <div className="space-y-6">
                <Select
                  label="Profile Visibility"
                  options={[
                    { value: 'public', label: 'Public' },
                    { value: 'team', label: 'Team Only' },
                    { value: 'private', label: 'Private' }
                  ]}
                  value={settings.privacy?.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                />

                <div className="space-y-4">
                  {[
                    { 
                      key: 'showOnlineStatus', 
                      label: 'Show Online Status', 
                      description: 'Let others see when you are online' 
                    },
                    { 
                      key: 'allowDirectMessages', 
                      label: 'Allow Direct Messages', 
                      description: 'Allow team members to send you direct messages' 
                    },
                    { 
                      key: 'shareAnalytics', 
                      label: 'Share Analytics Data', 
                      description: 'Help improve the platform by sharing anonymous usage data' 
                    }
                  ].map((setting) => (
                    <ToggleSwitch
                      key={setting.key}
                      checked={(settings.privacy as Record<string, any>)[setting.key] || false}
                      onChange={(checked) => handleSettingChange('privacy', setting.key, checked)}
                      label={setting.label}
                      description={setting.description}
                    />
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('privacy')}
                    disabled={saving}
                    className="flex items-center"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* Account Information */}
              <SettingsCard 
                title="Account Information" 
                description="View your account details and usage statistics."
              >
                {accountInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className={`font-semibold text-gray-900 mb-4 ${MontserratFont.className}`}>
                        Account Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Created:</span>
                          <span className="font-medium">{accountInfo.account_created}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Login:</span>
                          <span className="font-medium">{accountInfo.last_login}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Logins:</span>
                          <span className="font-medium">{accountInfo.total_logins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Status:</span>
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {accountInfo.account_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className={`font-semibold text-gray-900 mb-4 ${MontserratFont.className}`}>
                        Storage Usage
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Documents:</span>
                          <span className="font-medium">{accountInfo.storage_used?.documents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Images:</span>
                          <span className="font-medium">{accountInfo.storage_used?.images}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Used:</span>
                          <span className="font-medium">{accountInfo.storage_used?.total_used}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${accountInfo.storage_used?.percentage_used}%`}}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {accountInfo.storage_used?.percentage_used}% of {accountInfo.storage_used?.total_allowed} used
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </SettingsCard>

              {/* Active Sessions */}
              <SettingsCard 
                title="Active Sessions" 
                description="Manage your active login sessions across devices."
              >
                {accountInfo?.active_sessions && (
                  <div className="space-y-4">
                    {accountInfo.active_sessions.map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            session.is_current ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <div className={`w-3 h-3 rounded-full ${
                              session.is_current ? 'bg-green-600' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <div>
                            <p className="font-medium">
                              {session.is_current ? 'Current Session' : 'Other Session'}
                            </p>
                            <p className="text-sm text-gray-600">{session.device} • {session.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm font-medium ${
                            session.is_current ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {session.last_activity}
                          </span>
                          {!session.is_current && (
                            <button className="text-sm text-red-600 hover:text-red-800">
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SettingsCard>

              {/* Data Management */}
              <SettingsCard 
                title="Data Management" 
                description="Export your data or manage your account."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div>
                      <h4 className={`font-medium text-blue-900 ${popinsFont['600'].className}`}>
                        Export Account Data
                      </h4>
                      <p className={`text-sm text-blue-700 ${popinsFont['400'].className}`}>
                        Download a copy of all your account data
                      </p>
                    </div>
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="flex items-center"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div>
                      <h4 className={`font-medium text-red-900 ${popinsFont['600'].className}`}>
                        Delete Account
                      </h4>
                      <p className={`text-sm text-red-700 ${popinsFont['400'].className}`}>
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </SettingsCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage