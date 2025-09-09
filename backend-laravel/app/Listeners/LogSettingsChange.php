<?php

namespace App\Listeners;

use App\Events\SettingsUpdated;
use Illuminate\Support\Facades\Log;

class LogSettingsChange
{
    public function handle(SettingsUpdated $event)
    {
        Log::info('User settings updated', [
            'user_id' => $event->user->id,
            'category' => $event->category,
            'settings' => $event->settings,
            'timestamp' => now()
        ]);

        // You can add additional logic here like:
        // - Sending notifications to admins
        // - Updating cached user preferences
        // - Triggering other system updates
    }
}
