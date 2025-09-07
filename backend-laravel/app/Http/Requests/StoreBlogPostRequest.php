<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Add your authorization logic here
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category_id' => 'required|exists:blog_categories,id',
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email|max:255',
            'author_bio' => 'nullable|string|max:1000',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tags' => 'array',
            'tags.*' => 'string|max:100',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'array',
            'seo_keywords.*' => 'string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Blog post title is required.',
            'excerpt.required' => 'Blog post excerpt is required.',
            'content.required' => 'Blog post content is required.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'Selected category does not exist.',
            'author_name.required' => 'Author name is required.',
            'author_email.required' => 'Author email is required.',
            'author_email.email' => 'Please provide a valid email address.',
            'featured_image.image' => 'Featured image must be an image file.',
            'featured_image.mimes' => 'Featured image must be a jpeg, png, jpg, or gif file.',
            'featured_image.max' => 'Featured image must not be larger than 2MB.',
        ];
    }
}