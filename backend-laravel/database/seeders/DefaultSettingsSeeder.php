<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserSetting;

class DefaultSettingsSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        $defaultSettings = [
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

        foreach ($users as $user) {
            foreach ($defaultSettings as $category => $settings) {
                foreach ($settings as $key => $value) {
                    UserSetting::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'category' => $category,
                            'key' => $key
                        ],
                        [
                            'value' => $value
                        ]
                    );
                }
            }
        }
    }
}
