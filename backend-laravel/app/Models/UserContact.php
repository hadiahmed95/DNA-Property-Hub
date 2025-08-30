<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserContact extends Model
{
    protected $fillable = [
        'user_id',
        'phone_no',
        'address_line_1',
        'city',
        'state',
        'zipcode',
        'country',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
