<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'status',
        'avatar',
        'last_login_at',
        'login_count',
        'two_factor_secret',
        'two_factor_enabled'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'login_count' => 'integer',
            'two_factor_enabled' => 'boolean'
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function contact()
    {
        return $this->hasOne(UserContact::class);
    }

    public function settings()
    {
        return $this->hasMany(UserSetting::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'created_by');
    }


    public function getUserSetting($category, $key, $default = null)
    {
        $setting = $this->settings()
            ->where('category', $category)
            ->where('key', $key)
            ->first();
        
        return $setting ? $setting->value : $default;
    }

}
