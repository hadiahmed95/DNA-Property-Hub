<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PropertyStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Basic Information
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_type' => ['required', Rule::in(['sale', 'rent_monthly', 'rent_weekly'])],
            
            // Property Details
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'numeric', 'min:0'],
            'half_bathrooms' => ['nullable', 'integer', 'min:0'],
            'square_footage' => ['nullable', 'integer', 'min:0'],
            'lot_size' => ['nullable', 'numeric', 'min:0'],
            'year_built' => ['nullable', 'integer', 'min:1800', 'max:' . (date('Y') + 5)],
            'floors' => ['nullable', 'integer', 'min:1'],
            
            // Financial Details
            'hoa_fees' => ['nullable', 'numeric', 'min:0'],
            'property_tax' => ['nullable', 'numeric', 'min:0'],
            
            // Location
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:50'],
            'zip_code' => ['required', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:50'],
            'neighborhood' => ['nullable', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            
            // Agent Information
            'agent_info' => ['required', 'array'],
            'agent_info.name' => ['required', 'string', 'max:255'],
            'agent_info.email' => ['required', 'email', 'max:255'],
            'agent_info.phone' => ['required', 'string', 'max:20'],
            
            // Specifications (Optional complex data)
            'specifications' => ['nullable', 'array'],
            'specifications.heating' => ['nullable', 'string'],
            'specifications.cooling' => ['nullable', 'string'],
            'specifications.parking' => ['nullable', 'string'],
            'specifications.garage' => ['nullable', 'string'],
            'specifications.flooring' => ['nullable', 'array'],
            'specifications.utilities' => ['nullable', 'array'],
            
            // Media
            'media' => ['nullable', 'array'],
            'media.images' => ['nullable', 'array'],
            'media.images.*' => ['nullable', 'string'], // URLs or file paths
            'media.virtual_tour' => ['nullable', 'url'],
            
            // Marketing Settings
            'marketing_settings' => ['nullable', 'array'],
            'marketing_settings.featured' => ['nullable', 'boolean'],
            'marketing_settings.show_address' => ['nullable', 'boolean'],
            'marketing_settings.allow_showings' => ['nullable', 'boolean'],
            'marketing_settings.open_house' => ['nullable', 'boolean'],
            'marketing_settings.open_house_date' => ['nullable', 'date'],
            'marketing_settings.open_house_time' => ['nullable', 'string'],
            
            // Dynamic Filters
            'filters' => ['nullable', 'array'],
            'filters.*' => ['nullable', 'array'],
            'filters.*.*' => ['nullable', 'integer', 'exists:filter_values,id'],
            
            // Meta - ADD THESE LINES
            'created_by' => ['required', 'integer', 'exists:users,id'],
            'is_featured' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set created_by to current authenticated user
        $this->merge([
            'created_by' => auth()->id(),
        ]);

        // Set default values
        if (!$this->has('country')) {
            $this->merge(['country' => 'United States']);
        }

        // Set published_at if not provided
        if (!$this->has('published_at')) {
            $this->merge(['published_at' => now()]);
        }

        // Convert string numbers to actual numbers
        if ($this->has('price')) {
            $this->merge([
                'price' => (float) str_replace(['$', ','], '', $this->price),
            ]);
        }

        if ($this->has('hoa_fees')) {
            $this->merge([
                'hoa_fees' => (float) str_replace(['$', ','], '', $this->hoa_fees),
            ]);
        }

        if ($this->has('property_tax')) {
            $this->merge([
                'property_tax' => (float) str_replace(['$', ','], '', $this->property_tax),
            ]);
        }
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Property title is required.',
            'description.required' => 'Property description is required.',
            'price.required' => 'Property price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price_type.in' => 'Price type must be sale, rent_monthly, or rent_weekly.',
            'address.required' => 'Property address is required.',
            'city.required' => 'City is required.',
            'state.required' => 'State is required.',
            'zip_code.required' => 'ZIP code is required.',
            'agent_info.required' => 'Agent information is required.',
            'agent_info.name.required' => 'Agent name is required.',
            'agent_info.email.required' => 'Agent email is required.',
            'agent_info.email.email' => 'Agent email must be a valid email address.',
            'agent_info.phone.required' => 'Agent phone number is required.',
            'year_built.min' => 'Year built cannot be before 1800.',
            'year_built.max' => 'Year built cannot be more than 5 years in the future.',
            'latitude.between' => 'Latitude must be between -90 and 90.',
            'longitude.between' => 'Longitude must be between -180 and 180.',
            'filters.*.*.exists' => 'One or more selected filter values are invalid.',
            'created_by.required' => 'User authentication is required.',
            'created_by.exists' => 'Invalid user specified.',
        ];
    }
}
