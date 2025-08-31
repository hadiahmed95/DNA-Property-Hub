<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained();
            $table->string('department');
            $table->string('job_title');
            $table->string('employee_id')->unique()->nullable();
            $table->date('joining_date');
            $table->foreignId('reporting_to_user_id')->nullable()->constrained('users');
            $table->text('skill_experties');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_profiles');
    }
};
