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
            'profile.department' => 'required|string',
            'profile.job_title' => 'required|string',
            'profile.employee_id' => 'required|unique:user_profiles,employee_id',
            'profile.joining_date' => 'required|date',
            'profile.reporting_to_user_id' => 'nullable|exists:users,id',
            'profile.skill_experties' => 'required|string',
            
            'contact.phone_no' => 'required|string',
            'contact.address_line_1' => 'required|string',
            'contact.city' => 'required|string',
            'contact.state' => 'required|string',
            'contact.zipcode' => 'required|string',
            'contact.country' => 'required|string',
            'contact.emergency_contact_name' => 'required|string',
            'contact.emergency_contact_phone' => 'required|string',
        ];
    }
}
