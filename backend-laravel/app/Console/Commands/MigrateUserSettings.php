<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Console\Command;

class MigrateUserSettings extends Command
{
    protected $signature = 'settings:migrate {--user= : Specific user ID to migrate}';
    protected $description = 'Migrate existing user preferences to new settings system';

    public function handle()
    {
        $userId = $this->option('user');
        
        if ($userId) {
            $users = User::where('id', $userId)->get();
        } else {
            $users = User::all();
        }

        $this->info('Starting settings migration...');
        
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

        $progressBar = $this->output->createProgressBar($users->count());
        
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
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->info("\nSettings migration completed for {$users->count()} users.");
    }
}
