<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('phone_no');
            $table->string('address_line_1');
            $table->string('city');
            $table->string('state');
            $table->string('zipcode');
            $table->string('country');
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_phone');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_contacts');
    }
};
