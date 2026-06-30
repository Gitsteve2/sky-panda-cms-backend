<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $user->loadMissing('roles');

        if (! $user->isSuperAdmin()) {
            abort(403, 'This area is restricted to super administrators.');
        }

        return $next($request);
    }
}
