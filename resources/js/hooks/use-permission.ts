import { usePage } from '@inertiajs/react';
import type { Auth } from '@/types';

export function usePermission() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isSuperAdmin = auth?.is_super_admin ?? false;

    function can(permission: string): boolean {
        if (isSuperAdmin) return true;
        return auth?.permissions?.includes(permission) ?? false;
    }

    function hasRole(role: string): boolean {
        if (role === 'super_admin') return isSuperAdmin;
        return auth?.roles?.includes(role) ?? false;
    }

    function canAny(permissions: string[]): boolean {
        return permissions.some((p) => can(p));
    }

    return { can, hasRole, canAny, isSuperAdmin };
}
