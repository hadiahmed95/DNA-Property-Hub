<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
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
    });
});
