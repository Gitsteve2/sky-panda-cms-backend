import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Pencil, Plus, Shield, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Permission { id: number; name: string; display_name: string }
interface RoleRow {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    permissions: string[];
    users_count: number;
}

function PermissionGrid({
    selected,
    onChange,
    permissionsByModule,
    disabled = false,
    idPrefix,
}: {
    selected: string[];
    onChange: (perms: string[]) => void;
    permissionsByModule: Record<string, Permission[]>;
    disabled?: boolean;
    idPrefix: string;
}) {
    function togglePerm(perm: string) {
        onChange(selected.includes(perm) ? selected.filter((p) => p !== perm) : [...selected, perm]);
    }

    function toggleModule(perms: Permission[]) {
        const modulePerms = perms.map((p) => p.name);
        const allChecked = modulePerms.every((p) => selected.includes(p));
        onChange(allChecked
            ? selected.filter((p) => !modulePerms.includes(p))
            : [...new Set([...selected, ...modulePerms])]
        );
    }

    return (
        <div className="space-y-4">
            {Object.entries(permissionsByModule).map(([module, perms]) => {
                const modulePerms = perms.map((p) => p.name);
                const checkedCount = modulePerms.filter((p) => selected.includes(p)).length;
                const allChecked = checkedCount === modulePerms.length;

                return (
                    <div key={module} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={allChecked}
                                onCheckedChange={() => !disabled && toggleModule(perms)}
                                disabled={disabled}
                            />
                            <span className="text-sm font-medium">{module}</span>
                            {checkedCount > 0 && (
                                <Badge variant="secondary" className="text-xs">{checkedCount}/{modulePerms.length}</Badge>
                            )}
                        </div>
                        <div className="ml-6 flex flex-wrap gap-3">
                            {perms.map((perm) => (
                                <div key={perm.name} className="flex items-center gap-1.5">
                                    <Checkbox
                                        id={`${idPrefix}-${perm.name}`}
                                        checked={selected.includes(perm.name)}
                                        onCheckedChange={() => !disabled && togglePerm(perm.name)}
                                        disabled={disabled}
                                    />
                                    <Label
                                        htmlFor={`${idPrefix}-${perm.name}`}
                                        className={`text-xs ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        {perm.name.split('.')[1]}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function RolesIndex({
    roles,
    permissionsByModule,
}: {
    roles: RoleRow[];
    permissionsByModule: Record<string, Permission[]>;
}) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const createForm = useForm({
        name: '',
        display_name: '',
        description: '',
        permissions: [] as string[],
    });

    const editForm = useForm({
        display_name: '',
        description: '',
        permissions: [] as string[],
    });

    function startEdit(role: RoleRow) {
        editForm.setData({
            display_name: role.display_name,
            description: role.description ?? '',
            permissions: [...role.permissions],
        });
        setEditingId(role.id);
        setExpandedId(role.id);
    }

    function cancelEdit() {
        setEditingId(null);
        editForm.reset();
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/cms/roles', {
            onSuccess: () => { createForm.reset(); setShowCreate(false); },
        });
    }

    function submitEdit(e: React.FormEvent, roleId: number) {
        e.preventDefault();
        editForm.put(`/cms/roles/${roleId}`, { onSuccess: () => cancelEdit() });
    }

    function deleteRole(role: RoleRow) {
        if (!confirm(`Delete role "${role.display_name}"? Users with this role will lose it.`)) return;
        router.delete(`/cms/roles/${role.id}`);
    }

    return (
        <>
            <Head title="Roles & Permissions" />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                        <p className="text-muted-foreground mt-1">{roles.length} role{roles.length !== 1 ? 's' : ''} defined</p>
                    </div>
                    <Button onClick={() => setShowCreate(true)} disabled={showCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Role
                    </Button>
                </div>

                {/* Create Form */}
                {showCreate && (
                    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Create New Role</h2>
                            <Button variant="ghost" size="sm" onClick={() => { setShowCreate(false); createForm.reset(); }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={submitCreate} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Role Key <span className="text-muted-foreground font-normal text-xs">(snake_case)</span></Label>
                                    <Input
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="content_manager"
                                    />
                                    <InputError message={createForm.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Display Name</Label>
                                    <Input
                                        value={createForm.data.display_name}
                                        onChange={(e) => createForm.setData('display_name', e.target.value)}
                                        placeholder="Content Manager"
                                    />
                                    <InputError message={createForm.errors.display_name} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
                                <Input
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    placeholder="Brief description"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Permissions</Label>
                                <div className="rounded-lg border border-border p-4">
                                    <PermissionGrid
                                        selected={createForm.data.permissions}
                                        onChange={(perms) => createForm.setData('permissions', perms)}
                                        permissionsByModule={permissionsByModule}
                                        idPrefix="create"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={createForm.processing}>
                                    {createForm.processing ? 'Creating...' : 'Create Role'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setShowCreate(false); createForm.reset(); }}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Roles List */}
                {roles.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center">
                        <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No roles defined yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {roles.map((role) => {
                            const isSuper = role.name === 'super_admin';
                            const isExpanded = expandedId === role.id;
                            const isEditing = editingId === role.id;

                            return (
                                <div key={role.id} className="rounded-xl border border-border bg-card overflow-hidden">
                                    <div className="px-6 py-4 flex items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium">{role.display_name}</span>
                                                <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{role.name}</code>
                                                {isSuper && <Badge className="text-xs bg-violet-100 text-violet-700 border-violet-200" variant="outline">System</Badge>}
                                                <Badge variant="secondary" className="text-xs">{role.users_count} user{role.users_count !== 1 ? 's' : ''}</Badge>
                                            </div>
                                            {role.description && (
                                                <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                                            )}
                                            {isSuper && (
                                                <p className="text-xs text-muted-foreground mt-0.5 italic">Bypasses all permission checks — full system access.</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {!isSuper && (
                                                <>
                                                    <Button variant="ghost" size="sm" onClick={() => isEditing ? cancelEdit() : startEdit(role)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => deleteRole(role)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="ghost" size="sm" onClick={() => setExpandedId(isExpanded ? null : role.id)}>
                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-border px-6 py-5">
                                            {isEditing ? (
                                                <form onSubmit={(e) => submitEdit(e, role.id)} className="space-y-5">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Display Name</Label>
                                                            <Input
                                                                value={editForm.data.display_name}
                                                                onChange={(e) => editForm.setData('display_name', e.target.value)}
                                                            />
                                                            <InputError message={editForm.errors.display_name} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Description</Label>
                                                            <Input
                                                                value={editForm.data.description}
                                                                onChange={(e) => editForm.setData('description', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">Permissions</Label>
                                                        <div className="rounded-lg border border-border p-4">
                                                            <PermissionGrid
                                                                selected={editForm.data.permissions}
                                                                onChange={(perms) => editForm.setData('permissions', perms)}
                                                                permissionsByModule={permissionsByModule}
                                                                idPrefix={`edit-${role.id}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button type="submit" disabled={editForm.processing}>
                                                            {editForm.processing ? 'Saving...' : 'Save Changes'}
                                                        </Button>
                                                        <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div>
                                                    {isSuper ? (
                                                        <p className="text-sm text-muted-foreground">Super admin has access to everything and cannot be restricted.</p>
                                                    ) : role.permissions.length === 0 ? (
                                                        <p className="text-sm text-muted-foreground">No permissions assigned to this role.</p>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {role.permissions.map((p) => (
                                                                <Badge key={p} variant="secondary" className="text-xs font-mono">{p}</Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
