<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->with('permissions')->get();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles',
            'description' => 'required|string',
            'color' => 'required|string',
            'permissions' => 'required|array',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            \DB::beginTransaction();

            $role = Role::create([
                'name' => $request->name,
                'description' => $request->description,
                'color' => $request->color,
                'is_default' => $request->is_default ?? false,
            ]);

            // Store permissions
            foreach ($request->permissions as $permission) {
                $role->permissions()->create(['permission' => $permission]);
            }

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role created successfully',
                'data' => $role->load('permissions')
            ], 201);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Role $role)
    {
        return response()->json(['success' => true, 'data' => $role->load('permissions')]);
    }

    public function update(Request $request, Role $role)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'required|string',
            'color' => 'required|string',
            'permissions' => 'required|array',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            \DB::beginTransaction();

            $role->update([
                'name' => $request->name,
                'description' => $request->description,
                'color' => $request->color,
                'is_default' => $request->is_default ?? $role->is_default,
            ]);

            // Update permissions
            if ($request->has('permissions')) {
                $role->permissions()->delete();
                foreach ($request->permissions as $permission) {
                    $role->permissions()->create(['permission' => $permission]);
                }
            }

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role updated successfully',
                'data' => $role->fresh()->load('permissions')
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['success' => true, 'message' => 'Role deleted successfully']);
    }
}
