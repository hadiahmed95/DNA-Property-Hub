<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        // ...existing code...
    ];

    public function boot()
    {
        $this->registerPolicies();
        Passport::routes();
    }
}