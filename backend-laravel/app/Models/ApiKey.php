<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Str;

class ApiKey extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'key',
        'permissions',
        'is_active'
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_active' => 'boolean',
        'last_used_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($apiKey) {
            $apiKey->key = 'ak_' . Str::random(40);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions ?? []);
    }

    public function updateLastUsed()
    {
        $this->last_used_at = now();
        $this->save();
    }

}
