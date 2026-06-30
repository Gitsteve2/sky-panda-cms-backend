<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')
            ->orderBy('name')
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'is_active' => $u->is_active,
                'created_at' => $u->created_at,
                'roles' => $u->roles->map(fn ($r) => ['id' => $r->id, 'name' => $r->name, 'display_name' => $r->display_name]),
            ]);

        return Inertia::render('cms/users/index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cms/users/form', [
            'user' => null,
            'roles' => Role::orderBy('display_name')->get(['id', 'name', 'display_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'is_active' => 'boolean',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_active' => $data['is_active'] ?? true,
            'email_verified_at' => now(),
        ]);

        if (! empty($data['roles'])) {
            $user->roles()->sync($data['roles']);
        }

        return redirect()->route('cms.users.index')->with('success', 'User created.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('cms/users/form', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'roles' => $user->roles->pluck('id'),
            ],
            'roles' => Role::orderBy('display_name')->get(['id', 'name', 'display_name']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'is_active' => 'boolean',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_active' => $data['is_active'] ?? $user->is_active,
        ]);

        if (! empty($data['password'])) {
            $user->update(['password' => Hash::make($data['password'])]);
        }

        $user->roles()->sync($data['roles'] ?? []);

        return redirect()->route('cms.users.index')->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        if ($user->isSuperAdmin() && User::whereHas('roles', fn ($q) => $q->where('name', 'super_admin'))->count() <= 1) {
            return back()->withErrors(['error' => 'Cannot delete the only super admin.']);
        }

        $user->delete();

        return redirect()->route('cms.users.index')->with('success', 'User deleted.');
    }

    public function toggleActive(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot deactivate your own account.']);
        }

        if ($user->isSuperAdmin()) {
            return back()->withErrors(['error' => 'Cannot deactivate a super admin.']);
        }

        $user->update(['is_active' => ! $user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "User {$status}.");
    }
}
