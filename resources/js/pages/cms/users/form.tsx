import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

interface Role { id: number; name: string; display_name: string }
interface UserData {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: number[];
}

export default function UserForm({ user, roles }: { user: UserData | null; roles: Role[] }) {
    const isEdit = !!user;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        is_active: user?.is_active ?? true,
        roles: user?.roles ?? [] as number[],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/cms/users/${user.id}`);
        } else {
            post('/cms/users');
        }
    }

    function toggleRole(roleId: number) {
        setData('roles', data.roles.includes(roleId)
            ? data.roles.filter((id) => id !== roleId)
            : [...data.roles, roleId]
        );
    }

    return (
        <>
            <Head title={isEdit ? 'Edit User' : 'Create User'} />
            <div className="space-y-8 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/cms/users">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit User' : 'Create User'}</h1>
                        {isEdit && <p className="text-muted-foreground mt-1">{user.email}</p>}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Account Details</h2>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Jane Smith"
                                autoComplete="off"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="jane@example.com"
                                autoComplete="off"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {isEdit ? 'New Password' : 'Password'}
                                {isEdit && <span className="text-muted-foreground font-normal ml-1">(leave blank to keep current)</span>}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={isEdit ? '••••••••' : 'Min 12 characters'}
                                    autoComplete="new-password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {data.password && (
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Repeat password"
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', !!checked)}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Account is active
                                <span className="block text-xs text-muted-foreground font-normal">Inactive users cannot log in.</span>
                            </Label>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Roles</h2>
                        {roles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No roles defined yet. <Link href="/cms/roles" className="underline">Create roles</Link> first.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center gap-3">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(role.id)}
                                            onCheckedChange={() => toggleRole(role.id)}
                                        />
                                        <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                                            {role.display_name}
                                            <span className="block text-xs text-muted-foreground font-mono font-normal">{role.name}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                        <InputError message={errors.roles} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/cms/users">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
