<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    protected $token;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test permissions
        $permissions = [
            'properties.create', 'properties.read', 'properties.update', 'properties.delete',
            'users.create', 'users.read', 'users.update', 'users.delete'
        ];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }

    /** @test */
    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'type' => 'agent'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'user',
                'access_token'
            ]);
    }

    /** @test */
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'user',
                'access_token'
            ]);

        $this->token = $response->json('access_token');
    }

    /** @test */
    public function test_can_get_logged_in_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'user'
            ]);
    }

    /** @test */
    public function test_can_create_role_with_permissions()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/roles', [
            'name' => 'Admin',
            'permissions' => [1, 2, 3, 4]
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'permissions'
                ]
            ]);
    }

    /** @test */
    public function test_can_create_user_with_profile_and_contact()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->accessToken;
        $role = Role::create(['name' => 'Agent']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'type' => 'agent',
            'profile' => [
                'role_id' => $role->id,
                'department' => 'Sales',
                'job_title' => 'Sales Agent',
                'employee_id' => 'EMP001',
                'joining_date' => '2023-01-01',
                'skill_experties' => 'Sales, Marketing'
            ],
            'contact' => [
                'phone_no' => '1234567890',
                'address_line_1' => '123 Street',
                'city' => 'New York',
                'state' => 'NY',
                'zipcode' => '10001',
                'country' => 'USA',
                'emergency_contact_name' => 'Jane Doe',
                'emergency_contact_phone' => '0987654321'
            ]
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'email',
                    'type',
                    'profile',
                    'contact'
                ]
            ]);
    }

    /** @test */
    public function test_can_update_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => $user->email
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Name');
    }

    /** @test */
    public function test_can_delete_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
    }
}
