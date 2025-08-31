<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['profile', 'contact'])->get();
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function store(UserStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'type' => $request->type ?? 'agent',
                'status' => $request->status ?? 'active',
            ]);

            $user->profile()->create($request->profile);
            $user->contact()->create($request->contact);

            DB::commit();
            return response()->json(['success' => true, 'data' => $user->load(['profile', 'contact'])]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(User $user)
    {
        return response()->json(['success' => true, 'data' => $user->load(['profile', 'contact'])]);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        DB::beginTransaction();
        try {
            $user->update($request->only(['name', 'email', 'type', 'status']));
            
            if ($request->has('profile')) {
                $user->profile()->update($request->profile);
            }
            
            if ($request->has('contact')) {
                $user->contact()->update($request->contact);
            }

            DB::commit();
            return response()->json(['success' => true, 'data' => $user->load(['profile', 'contact'])]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['success' => true, 'message' => 'User deleted successfully']);
    }
}
