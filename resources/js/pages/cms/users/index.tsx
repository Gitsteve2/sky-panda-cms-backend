import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2, UserCheck, UserX, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Role { id: number; name: string; display_name: string }
interface UserRow {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    roles: Role[];
}

export default function UsersIndex({ users }: { users: UserRow[] }) {
    function toggleActive(user: UserRow) {
        const action = user.is_active ? 'deactivate' : 'activate';
        if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;
        router.patch(`/cms/users/${user.id}/toggle-active`);
    }

    function deleteUser(user: UserRow) {
        if (!confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return;
        router.delete(`/cms/users/${user.id}`);
    }

    return (
        <>
            <Head title="Users" />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground mt-1">{users.length} user{users.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <Button asChild>
                        <Link href="/cms/users/create">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New User
                        </Link>
                    </Button>
                </div>

                {users.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center">
                        <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No users yet.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Roles</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-sm">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.length === 0 ? (
                                                    <span className="text-xs text-muted-foreground">No role</span>
                                                ) : (
                                                    user.roles.map((r) => (
                                                        <Badge key={r.id} variant="secondary" className="text-xs">
                                                            {r.display_name}
                                                        </Badge>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${user.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}
                                            >
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    title={user.is_active ? 'Deactivate' : 'Activate'}
                                                    onClick={() => toggleActive(user)}
                                                >
                                                    {user.is_active
                                                        ? <UserX className="h-4 w-4 text-amber-500" />
                                                        : <UserCheck className="h-4 w-4 text-green-500" />
                                                    }
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/cms/users/${user.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => deleteUser(user)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
