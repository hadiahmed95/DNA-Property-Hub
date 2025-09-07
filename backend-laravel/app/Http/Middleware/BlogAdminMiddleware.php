<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlogAdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and has blog admin permissions
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Add your role/permission checking logic here
        // For example, if you're using Spatie Laravel Permission:
        // if (!$request->user()->hasPermission('manage-blog')) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Insufficient permissions'
        //     ], 403);
        // }

        return $next($request);
    }
}
