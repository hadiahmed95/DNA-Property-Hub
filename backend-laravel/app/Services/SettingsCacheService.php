<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Support\Facades\Cache;

class SettingsCacheService
{
    protected $cachePrefix = 'user_settings:';
    protected $cacheTtl = 3600; // 1 hour

    public function getUserSettings(int $userId): array
    {
        $cacheKey = $this->cachePrefix . $userId;
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($userId) {
            return UserSetting::getUserSettings($userId);
        });
    }

    public function invalidateUserSettings(int $userId): void
    {
        $cacheKey = $this->cachePrefix . $userId;
        Cache::forget($cacheKey);
    }

    public function updateUserSetting(int $userId, string $category, string $key, $value): void
    {
        UserSetting::updateUserSetting($userId, $category, $key, $value);
        $this->invalidateUserSettings($userId);
    }

    public function getUserSetting(int $userId, string $category, string $key, $default = null)
    {
        $settings = $this->getUserSettings($userId);
        return $settings[$category][$key] ?? $default;
    }
}