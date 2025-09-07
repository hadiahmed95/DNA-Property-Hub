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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            
            // Core numeric fields for filtering
            $table->decimal('price', 15, 2);
            $table->enum('price_type', ['sale', 'rent_monthly', 'rent_weekly'])->default('sale');
            $table->integer('bedrooms')->nullable();
            $table->decimal('bathrooms', 3, 1)->nullable();
            $table->integer('half_bathrooms')->nullable();
            $table->integer('square_footage')->nullable();
            $table->decimal('lot_size', 10, 2)->nullable();
            $table->year('year_built')->nullable();
            $table->integer('floors')->nullable();
            
            // Financial details
            $table->decimal('hoa_fees', 10, 2)->nullable();
            $table->decimal('property_tax', 10, 2)->nullable();
            
            // Location data
            $table->string('address');
            $table->string('city', 100);
            $table->string('state', 50);
            $table->string('zip_code', 20);
            $table->string('country', 50)->default('United States');
            $table->string('neighborhood', 100)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Agent information (JSON for flexibility)
            $table->json('agent_info'); // {name, email, phone}
            
            // Complex data that doesn't need filtering
            $table->json('specifications')->nullable(); // heating, cooling, parking, garage, etc
            $table->json('media')->nullable(); // {images: [], virtual_tour: ''}
            $table->json('marketing_settings')->nullable(); // featured, show_address, open_house, etc
            
            // Meta fields
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['price', 'price_type']);
            $table->index(['bedrooms', 'bathrooms']);
            $table->index(['city', 'state']);
            $table->index(['is_active', 'published_at']);
            $table->index(['is_featured', 'published_at']);
            $table->fullText(['title', 'description', 'address']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
