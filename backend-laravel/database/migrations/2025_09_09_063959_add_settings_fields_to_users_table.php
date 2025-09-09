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
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->timestamp('last_login_at')->nullable()->after('avatar');
            $table->integer('login_count')->default(0)->after('last_login_at');
            $table->string('two_factor_secret')->nullable()->after('login_count');
            $table->boolean('two_factor_enabled')->default(false)->after('two_factor_secret');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'last_login_at',
                'login_count',
                'two_factor_secret',
                'two_factor_enabled'
            ]);
        });
    }
};
