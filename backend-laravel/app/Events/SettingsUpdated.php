<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SettingsUpdated
{
    use Dispatchable, SerializesModels;

    public $user;
    public $category;
    public $settings;

    public function __construct(User $user, string $category, array $settings)
    {
        $this->user = $user;
        $this->category = $category;
        $this->settings = $settings;
    }
}
