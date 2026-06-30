<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        $authData = null;
        if ($user) {
            $user->loadMissing(['roles.permissions', 'permissions']);

            $authData = [
                'user' => $user,
                'roles' => $user->roles->pluck('name')->toArray(),
                'permissions' => $user->getAllPermissions(),
                'is_super_admin' => $user->isSuperAdmin(),
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => $authData,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
