<?php

namespace App\Http\Middleware;

use App\Models\Permission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        // Load relationships once
        $user->loadMissing(['roles.permissions', 'permissions']);

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Allow through if RBAC hasn't been seeded yet (safe during initial deploy)
        if (Permission::count() === 0) {
            return $next($request);
        }

        if (! $user->hasPermission($permission)) {
            abort(403, 'You do not have permission to perform this action.');
        }

        return $next($request);
    }
}
