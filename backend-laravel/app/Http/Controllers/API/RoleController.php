<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Requests\RoleRequest;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json(['success' => true, 'data' => $roles]);
    }

    public function store(RoleRequest $request)
    {
        $role = Role::create($request->only('name'));
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }
        return response()->json(['success' => true, 'data' => $role->load('permissions')]);
    }

    public function show(Role $role)
    {
        return response()->json(['success' => true, 'data' => $role->load('permissions')]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        $role->update($request->only('name'));
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }
        return response()->json(['success' => true, 'data' => $role->load('permissions')]);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['success' => true, 'message' => 'Role deleted successfully']);
    }
}
