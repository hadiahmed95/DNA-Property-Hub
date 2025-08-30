<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('user')->id;
        
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $userId,
            'type' => 'sometimes|in:agent,admin',
            'status' => 'sometimes|in:active,inactive',
            
            'profile.role_id' => 'sometimes|exists:roles,id',
            'profile.department' => 'sometimes|string',
            'profile.job_title' => 'sometimes|string',
            'profile.employee_id' => 'sometimes|unique:user_profiles,employee_id,' . $userId . ',user_id',
            'profile.joining_date' => 'sometimes|date',
            'profile.reporting_to_user_id' => 'nullable|exists:users,id',
            'profile.skill_experties' => 'sometimes|string',
            
            'contact.phone_no' => 'sometimes|string',
            'contact.address_line_1' => 'sometimes|string',
            'contact.city' => 'sometimes|string',
            'contact.state' => 'sometimes|string',
            'contact.zipcode' => 'sometimes|string',
            'contact.country' => 'sometimes|string',
            'contact.emergency_contact_name' => 'sometimes|string',
            'contact.emergency_contact_phone' => 'sometimes|string',
        ];
    }
}
