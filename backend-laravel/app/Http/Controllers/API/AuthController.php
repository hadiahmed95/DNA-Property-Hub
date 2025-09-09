<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'type' => 'required|in:agent,admin',
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);
        $user = User::create($validatedData);

        $token = $user->createToken('auth_token')->accessToken;

        return response()->json([
            'success' => true,
            'user' => $user,
            'access_token' => $token
        ]);
    }

    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!auth()->attempt($validatedData)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = auth()->user();
        
        // Update login tracking
        $user->last_login_at = now();
        $user->login_count = ($user->login_count ?? 0) + 1;
        $user->save();

        $token = $user->createToken('auth_token')->accessToken;

        return response()->json([
            'success' => true,
            'user' => $user->load(['profile', 'contact']),
            'access_token' => $token
        ]);
    }

    public function getLoggedInUser()
    {
        $user = auth()->user()->load(['profile', 'contact']);
        
        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }
}
