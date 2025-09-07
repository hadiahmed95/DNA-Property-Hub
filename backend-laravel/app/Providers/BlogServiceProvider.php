<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\BlogService;

class BlogServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(BlogService::class, function ($app) {
            return new BlogService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register blog configuration
        $this->mergeConfigFrom(__DIR__.'/../../config/blog.php', 'blog');

        // Publish configuration
        $this->publishes([
            __DIR__.'/../../config/blog.php' => config_path('blog.php'),
        ], 'blog-config');
    }
}
