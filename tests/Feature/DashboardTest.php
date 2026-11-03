<?php

use App\Models\Role;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('cms.dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $role = Role::firstOrCreate(
        ['name' => 'super_admin'],
        ['display_name' => 'Super Admin', 'description' => 'Full access']
    );
    $user = User::factory()->create(['is_active' => true]);
    $user->roles()->sync([$role->id]);
    $this->actingAs($user);

    $response = $this->get(route('cms.dashboard'));
    $response->assertOk();
});
