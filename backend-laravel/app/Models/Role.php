<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description',
        'color',
        'user_count',
        'is_default',
    ];

    public function permissions()
    {
        return $this->hasMany(RolePermissions::class);
    }

    public function users()
    {
        return $this->hasMany(UserProfile::class);
    }
}
