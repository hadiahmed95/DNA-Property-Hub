<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\FilterController;
use Illuminate\Support\Facades\Route;

// API v1 Routes
Route::prefix('v1')->group(function () {
    // Auth routes - No auth required
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
        Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    });

    // Public routes - No auth required
    Route::prefix('public')->group(function () {
        // Public property routes
        Route::get('properties', [PropertyController::class, 'index']);
        Route::get('properties/featured', [PropertyController::class, 'featured']);
        Route::get('properties/search', [PropertyController::class, 'search']);
        Route::get('properties/stats', [PropertyController::class, 'stats']);
        Route::get('properties/filters', [PropertyController::class, 'filters']);
        Route::get('properties/{id}', [PropertyController::class, 'show'])->where('id', '[0-9]+');
        Route::get('properties/slug/{slug}', [PropertyController::class, 'showBySlug']);
        
        // Public filter routes
        Route::get('filters/groups', [FilterController::class, 'getFilterGroups']);
        Route::get('filters/groups/{filterGroupId}/values', [FilterController::class, 'getFilterValues']);
        Route::get('filters/values-with-counts', [FilterController::class, 'getFilterValuesWithCounts']);
        Route::get('filters/search', [FilterController::class, 'searchFilterValues']);
    });

    // Protected routes - Auth required
    Route::middleware(['auth:api'])->group(function () {
        Route::get('user', [AuthController::class, 'getLoggedInUser']);

        // User management routes
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{user}', [UserController::class, 'show']);
            Route::put('/{user}', [UserController::class, 'update']);
            Route::delete('/{user}', [UserController::class, 'destroy']);
        });

        // Role management routes
        Route::apiResource('roles', RoleController::class);

        // Property management routes (authenticated)
        Route::prefix('properties')->group(function () {
            Route::post('/', [PropertyController::class, 'store']);
            Route::put('/{property}', [PropertyController::class, 'update']);
            Route::delete('/{property}', [PropertyController::class, 'destroy']);
            Route::get('/my-properties', [PropertyController::class, 'myProperties']);
            Route::patch('/{property}/toggle-featured', [PropertyController::class, 'toggleFeatured']);
        });

        // Filter management routes (Admin only)
        Route::middleware(['admin'])->prefix('admin/filters')->group(function () {
            // Filter groups
            Route::post('groups', [FilterController::class, 'storeFilterGroup']);
            Route::put('groups/{filterGroup}', [FilterController::class, 'updateFilterGroup']);
            Route::delete('groups/{filterGroup}', [FilterController::class, 'destroyFilterGroup']);
            Route::post('groups/reorder', [FilterController::class, 'reorderFilterGroups']);
            
            // Filter values
            Route::post('values', [FilterController::class, 'storeFilterValue']);
            Route::post('values/bulk', [FilterController::class, 'bulkCreateFilterValues']);
            Route::put('values/{filterValue}', [FilterController::class, 'updateFilterValue']);
            Route::delete('values/{filterValue}', [FilterController::class, 'destroyFilterValue']);
            Route::post('values/reorder', [FilterController::class, 'reorderFilterValues']);
            
            // Usage statistics
            Route::get('usage-stats', [FilterController::class, 'getUsageStats']);
        });
    });
});
