<?php

namespace Database\Factories;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    public function definition(): array
    {
        $authors = [
            ['name' => 'Sarah Ahmed', 'email' => 'sarah@dnaproperties.com'],
            ['name' => 'Ahmed Hassan', 'email' => 'ahmed@dnaproperties.com'],
            ['name' => 'Maria Rodriguez', 'email' => 'maria@dnaproperties.com'],
            ['name' => 'Omar Al-Rashid', 'email' => 'omar@dnaproperties.com'],
            ['name' => 'Jennifer Thompson', 'email' => 'jennifer@dnaproperties.com'],
        ];

        $author = $this->faker->randomElement($authors);

        return [
            'title' => $this->faker->sentence(6, true),
            'excerpt' => $this->faker->paragraph(3),
            'content' => $this->generateContent(),
            'author_name' => $author['name'],
            'author_email' => $author['email'],
            'author_bio' => $this->faker->paragraph(2),
            'category_id' => BlogCategory::factory(),
            'status' => $this->faker->randomElement(['draft', 'published']),
            'is_featured' => $this->faker->boolean(20), // 20% chance of being featured
            'views_count' => $this->faker->numberBetween(0, 5000),
            'published_at' => $this->faker->optional(0.8)->dateTimeBetween('-1 year', 'now'),
            'seo_title' => $this->faker->sentence(8),
            'seo_description' => $this->faker->paragraph(1),
            'seo_keywords' => $this->faker->words(5),
        ];
    }

    private function generateContent(): string
    {
        $content = "# " . $this->faker->sentence(4) . "\n\n";
        $content .= $this->faker->paragraph(4) . "\n\n";
        $content .= "## " . $this->faker->sentence(3) . "\n\n";
        $content .= $this->faker->paragraph(6) . "\n\n";
        $content .= "### Key Points\n\n";
        $content .= "- " . $this->faker->sentence() . "\n";
        $content .= "- " . $this->faker->sentence() . "\n";
        $content .= "- " . $this->faker->sentence() . "\n\n";
        $content .= "> " . $this->faker->paragraph(2) . "\n\n";
        $content .= $this->faker->paragraph(5) . "\n\n";
        $content .= "## Conclusion\n\n";
        $content .= $this->faker->paragraph(3);

        return $content;
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}