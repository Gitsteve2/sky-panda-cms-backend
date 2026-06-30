<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with('permissions')->orderBy('display_name')->get()->map(fn (Role $r) => [
            'id' => $r->id,
            'name' => $r->name,
            'display_name' => $r->display_name,
            'description' => $r->description,
            'permissions' => $r->permissions->pluck('name'),
            'users_count' => $r->users()->count(),
        ]);

        $permissions = Permission::orderBy('module')->orderBy('display_name')->get()
            ->groupBy('module')
            ->map(fn ($perms) => $perms->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'display_name' => $p->display_name,
            ]));

        return Inertia::render('cms/roles/index', [
            'roles' => $roles,
            'permissionsByModule' => $permissions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:roles,name|regex:/^[a-z_]+$/',
            'display_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $data['name'],
            'display_name' => $data['display_name'],
            'description' => $data['description'] ?? null,
        ]);

        if (! empty($data['permissions'])) {
            $permIds = Permission::whereIn('name', $data['permissions'])->pluck('id');
            $role->permissions()->sync($permIds);
        }

        return back()->with('success', 'Role created.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        if ($role->name === 'super_admin') {
            return back()->withErrors(['error' => 'The super_admin role cannot be modified.']);
        }

        $data = $request->validate([
            'display_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->update([
            'display_name' => $data['display_name'],
            'description' => $data['description'] ?? null,
        ]);

        $permIds = Permission::whereIn('name', $data['permissions'] ?? [])->pluck('id');
        $role->permissions()->sync($permIds);

        return back()->with('success', 'Role updated.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, ['super_admin', 'admin'])) {
            return back()->withErrors(['error' => 'This built-in role cannot be deleted.']);
        }

        $role->delete();

        return back()->with('success', 'Role deleted.');
    }
}
