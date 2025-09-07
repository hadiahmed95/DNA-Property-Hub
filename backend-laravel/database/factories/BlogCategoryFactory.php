<?php

namespace Database\Factories;

use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogCategoryFactory extends Factory
{
    protected $model = BlogCategory::class;

    public function definition(): array
    {
        $categories = [
            'Market Insights',
            'Business Development', 
            'Career Development',
            'Market Analysis',
            'Investment Guide',
            'Sustainability'
        ];

        $colors = ['#eca820', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#22c55e'];

        return [
            'name' => $this->faker->unique()->randomElement($categories),
            'description' => $this->faker->paragraph(2),
            'color' => $this->faker->randomElement($colors),
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}