<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'role_id',
        'department',
        'job_title',
        'employee_id',
        'joining_date',
        'reporting_to_user_id',
        'skill_experties',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function reportingTo()
    {
        return $this->belongsTo(User::class, 'reporting_to_user_id');
    }
}
