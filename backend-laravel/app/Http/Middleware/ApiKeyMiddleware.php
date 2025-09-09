<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ApiKey;

class ApiKeyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-API-Key') ?? $request->input('api_key');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API key is required'
            ], 401);
        }

        $key = ApiKey::where('key', $apiKey)
                     ->where('is_active', true)
                     ->first();

        if (!$key) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid API key'
            ], 401);
        }

        // Update last used timestamp
        $key->updateLastUsed();

        // Set the user for the request
        auth()->login($key->user);
        
        $request->merge(['api_key_used' => $key]);

        return $next($request);
    }
}