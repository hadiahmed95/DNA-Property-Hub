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
        Schema::create('filter_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filter_group_id')->constrained()->onDelete('cascade');
            $table->string('value', 255);
            $table->string('label', 255); // Display name
            $table->string('slug', 255)->nullable(); // for URLs
            $table->string('color', 7)->nullable(); // hex color for UI
            $table->string('icon', 100)->nullable(); // icon class or name
            $table->text('description')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable(); // additional data
            $table->timestamps();

            $table->index(['filter_group_id', 'is_active']);
            $table->index(['filter_group_id', 'display_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_values');
    }
};
