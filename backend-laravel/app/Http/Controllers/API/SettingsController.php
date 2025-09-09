<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function getUserSettings()
    {
        try {
            $user = auth()->user();
            $userSettings = UserSetting::getUserSettings($user->id);
            
            // Get user profile data
            $profile = [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'title' => $user->profile->job_title ?? '',
                'department' => $user->profile->department ?? '',
                'phone' => $user->contact->phone_no ?? '',
                'timezone' => $userSettings['profile']['timezone'] ?? 'America/New_York',
                'language' => $userSettings['profile']['language'] ?? 'en'
            ];

            // Default settings structure
            $defaultSettings = [
                'profile' => $profile,
                'notifications' => [
                    'emailNotifications' => true,
                    'smsNotifications' => false,
                    'pushNotifications' => true,
                    'marketingEmails' => false,
                    'weeklyReports' => true,
                    'propertyAlerts' => true,
                    'taskReminders' => true
                ],
                'security' => [
                    'twoFactorAuth' => false,
                    'loginAlerts' => true,
                    'passwordChangeRequired' => false,
                    'sessionTimeout' => 30
                ],
                'display' => [
                    'theme' => 'light',
                    'language' => 'en',
                    'dateFormat' => 'MM/DD/YYYY',
                    'timezone' => 'America/New_York',
                    'currency' => 'USD',
                    'itemsPerPage' => 25
                ],
                'privacy' => [
                    'profileVisibility' => 'team',
                    'showOnlineStatus' => true,
                    'allowDirectMessages' => true,
                    'shareAnalytics' => false
                ]
            ];

            // Merge with user settings
            foreach ($userSettings as $category => $settings) {
                if (isset($defaultSettings[$category])) {
                    $defaultSettings[$category] = array_merge(
                        $defaultSettings[$category], 
                        $settings
                    );
                }
            }

            return response()->json([
                'success' => true,
                'data' => $defaultSettings
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateSettings(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category' => 'required|string|in:profile,notifications,security,display,privacy',
                'settings' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();
            $category = $request->category;
            $settings = $request->settings;

            // Handle profile updates separately
            if ($category === 'profile') {
                $this->updateProfile($user, $settings);
            }

            // Update settings in user_settings table
            foreach ($settings as $key => $value) {
                // Skip profile fields that are handled separately
                if ($category === 'profile' && in_array($key, ['name', 'email', 'title', 'department', 'phone'])) {
                    continue;
                }

                UserSetting::updateUserSetting($user->id, $category, $key, $value);
            }

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function updateProfile($user, $settings)
    {
        // Update user table
        if (isset($settings['name'])) {
            $user->name = $settings['name'];
        }
        if (isset($settings['email'])) {
            $user->email = $settings['email'];
        }
        $user->save();

        // Update profile
        if ($user->profile) {
            if (isset($settings['title'])) {
                $user->profile->job_title = $settings['title'];
            }
            if (isset($settings['department'])) {
                $user->profile->department = $settings['department'];
            }
            $user->profile->save();
        }

        // Update contact
        if ($user->contact) {
            if (isset($settings['phone'])) {
                $user->contact->phone_no = $settings['phone'];
            }
            $user->contact->save();
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required',
                'new_password' => 'required|min:8|confirmed',
                'new_password_confirmation' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadAvatar(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();

            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');

            // Update user
            $user->avatar = $avatarPath;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Avatar uploaded successfully',
                'data' => [
                    'avatar_url' => Storage::disk('public')->url($avatarPath)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAccountInfo()
    {
        try {
            $user = auth()->user();

            $accountInfo = [
                'account_created' => $user->created_at->format('M d, Y'),
                'last_login' => $user->last_login_at ? $user->last_login_at->format('M d, Y g:i A') : 'Never',
                'total_logins' => $user->login_count ?? 0,
                'account_status' => $user->status ?? 'active',
                'storage_used' => $this->calculateStorageUsage($user->id),
                'active_sessions' => $this->getActiveSessions($user->id)
            ];

            return response()->json([
                'success' => true,
                'data' => $accountInfo
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve account info',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function calculateStorageUsage($userId)
    {
        // This is a simplified calculation
        // In reality, you'd calculate based on actual file storage
        return [
            'documents' => '234 MB',
            'images' => '1.2 GB',
            'total_used' => '1.4 GB',
            'total_allowed' => '5 GB',
            'percentage_used' => 28
        ];
    }

    private function getActiveSessions($userId)
    {
        // This is a mock implementation
        // In reality, you'd store and track user sessions
        return [
            [
                'id' => 1,
                'device' => 'Chrome on Windows',
                'location' => 'Lahore, Pakistan',
                'last_activity' => 'Active Now',
                'is_current' => true
            ],
            [
                'id' => 2,
                'device' => 'Safari on iPhone',
                'location' => 'Lahore, Pakistan',
                'last_activity' => '2 hours ago',
                'is_current' => false
            ]
        ];
    }

    public function exportAccountData()
    {
        try {
            $user = auth()->user();
            
            // Collect all user data
            $userData = [
                'profile' => $user->toArray(),
                'settings' => UserSetting::getUserSettings($user->id),
                'properties' => $user->properties()->get()->toArray(),
                'activity_log' => [], // Add activity logs if you have them
                'exported_at' => now()->toISOString()
            ];

            // Create a temporary file
            $filename = 'user_data_' . $user->id . '_' . now()->format('Y_m_d_H_i_s') . '.json';
            $filePath = storage_path('app/temp/' . $filename);
            
            // Ensure temp directory exists
            if (!file_exists(dirname($filePath))) {
                mkdir(dirname($filePath), 0755, true);
            }

            file_put_contents($filePath, json_encode($userData, JSON_PRETTY_PRINT));

            return response()->download($filePath, $filename)->deleteFileAfterSend();

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export account data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}