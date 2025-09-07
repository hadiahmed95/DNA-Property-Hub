<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->json('images')->nullable(); // Additional images
            
            // Author relationship
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');

            // Category relationship
            $table->foreignId('category_id')->constrained('blog_categories')->onDelete('cascade');
            
            // Meta information
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->string('reading_time')->default('5 min read');
            $table->integer('views_count')->default(0);
            
            // SEO fields
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->json('seo_keywords')->nullable();
            
            // Publishing dates
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['status', 'published_at']);
            $table->index(['is_featured', 'published_at']);
            $table->index('category_id');
            $table->fullText(['title', 'excerpt', 'content']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
