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
        Schema::create('property_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('filter_group_id')->constrained()->onDelete('cascade');
            $table->foreignId('filter_value_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Unique constraint to prevent duplicates
            $table->unique(['property_id', 'filter_group_id', 'filter_value_id'], 'property_filter_unique');
            
            // Indexes for performance
            $table->index(['property_id', 'filter_group_id']);
            $table->index(['filter_group_id', 'filter_value_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_filters');
    }
};
