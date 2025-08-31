<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'type' => 'required|in:agent,admin',
            'status' => 'nullable|in:active,inactive',
            
            'profile.role_id' => 'required|exists:roles,id',
            'profile.department' => 'nullable|string',
            'profile.job_title' => 'required|string',
            'profile.employee_id' => 'nullable|unique:user_profiles,employee_id',
            'profile.joining_date' => 'nullable|date',
            'profile.reporting_to_user_id' => 'nullable|exists:users,id',
            'profile.skill_experties' => 'nullable|string',
            
            'contact.phone_no' => 'required|string',
            'contact.address_line_1' => 'nullable|string',
            'contact.city' => 'nullable|string',
            'contact.state' => 'nullable|string',
            'contact.zipcode' => 'nullable|string',
            'contact.country' => 'nullable|string',
            'contact.emergency_contact_name' => 'nullable|string',
            'contact.emergency_contact_phone' => 'nullable|string',
        ];
    }
}
