<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        $category = $this->input('category');

        $rules = [
            'category' => 'required|string|in:profile,notifications,security,display,privacy',
            'settings' => 'required|array'
        ];

        // Category-specific validation
        switch ($category) {
            case 'profile':
                $rules['settings.name'] = 'sometimes|string|max:255';
                $rules['settings.email'] = 'sometimes|email|unique:users,email,' . auth()->id();
                $rules['settings.title'] = 'sometimes|string|max:255';
                $rules['settings.department'] = 'sometimes|string|max:255';
                $rules['settings.phone'] = 'sometimes|string|max:20';
                $rules['settings.timezone'] = 'sometimes|string|max:50';
                break;

            case 'notifications':
                $rules['settings.*'] = 'sometimes|boolean';
                break;

            case 'security':
                $rules['settings.twoFactorAuth'] = 'sometimes|boolean';
                $rules['settings.loginAlerts'] = 'sometimes|boolean';
                $rules['settings.passwordChangeRequired'] = 'sometimes|boolean';
                $rules['settings.sessionTimeout'] = 'sometimes|integer|min:5|max:1440';
                break;

            case 'display':
                $rules['settings.theme'] = 'sometimes|string|in:light,dark,auto';
                $rules['settings.language'] = 'sometimes|string|max:5';
                $rules['settings.dateFormat'] = 'sometimes|string|max:20';
                $rules['settings.currency'] = 'sometimes|string|max:3';
                $rules['settings.itemsPerPage'] = 'sometimes|integer|min:10|max:100';
                break;

            case 'privacy':
                $rules['settings.profileVisibility'] = 'sometimes|string|in:public,team,private';
                $rules['settings.showOnlineStatus'] = 'sometimes|boolean';
                $rules['settings.allowDirectMessages'] = 'sometimes|boolean';
                $rules['settings.shareAnalytics'] = 'sometimes|boolean';
                break;
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'category.required' => 'Settings category is required.',
            'category.in' => 'Invalid settings category.',
            'settings.required' => 'Settings data is required.',
            'settings.array' => 'Settings must be an array.',
            'settings.name.string' => 'Name must be a string.',
            'settings.email.email' => 'Please provide a valid email address.',
            'settings.email.unique' => 'This email is already taken.',
            'settings.sessionTimeout.min' => 'Session timeout must be at least 5 minutes.',
            'settings.sessionTimeout.max' => 'Session timeout cannot exceed 24 hours.',
            'settings.itemsPerPage.min' => 'Items per page must be at least 10.',
            'settings.itemsPerPage.max' => 'Items per page cannot exceed 100.',
        ];
    }
}
