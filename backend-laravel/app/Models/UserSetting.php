<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getUserSettings($userId)
    {
        $settings = self::where('user_id', $userId)->get();
        
        $grouped = $settings->groupBy('category');
        
        $result = [];
        foreach ($grouped as $category => $categorySettings) {
            $result[$category] = [];
            foreach ($categorySettings as $setting) {
                $result[$category][$setting->key] = $setting->value;
            }
        }
        
        return $result;
    }

    public static function updateUserSetting($userId, $category, $key, $value)
    {
        return self::updateOrCreate(
            [
                'user_id' => $userId,
                'category' => $category,
                'key' => $key
            ],
            [
                'value' => $value
            ]
        );
    }
}
