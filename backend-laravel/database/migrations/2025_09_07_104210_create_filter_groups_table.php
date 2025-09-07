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
        Schema::create('filter_groups', function (Blueprint $table) {
            $table->id();
            $table->string('page', 50)->index(); // properties, services, etc
            $table->string('name', 100); // type, status, location, etc
            $table->string('slug', 100)->unique(); // property_type, property_status
            $table->enum('data_type', ['string', 'integer', 'decimal', 'boolean'])->default('string');
            $table->boolean('is_multiple')->default(false); // can select multiple values
            $table->boolean('is_required')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->string('description')->nullable();
            $table->timestamps();

            $table->index(['page', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_groups');
    }
};
