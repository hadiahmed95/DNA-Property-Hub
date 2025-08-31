<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->string('permission');

            $table->unique(['role_id', 'permission']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('role_permissions');
    }
};
