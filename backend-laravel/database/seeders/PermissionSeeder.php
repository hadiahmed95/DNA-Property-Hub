<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            'properties.create',
            'properties.read',
            'properties.update',
            'properties.delete',
            'users.create',
            'users.read',
            'users.update',
            'users.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
