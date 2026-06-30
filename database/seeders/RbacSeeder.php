<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RbacSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'pages.view',    'display_name' => 'View Pages',    'module' => 'Pages'],
            ['name' => 'pages.create',  'display_name' => 'Create Pages',  'module' => 'Pages'],
            ['name' => 'pages.edit',    'display_name' => 'Edit Pages',    'module' => 'Pages'],
            ['name' => 'pages.delete',  'display_name' => 'Delete Pages',  'module' => 'Pages'],

            ['name' => 'blog.view',   'display_name' => 'View Blog',         'module' => 'Blog'],
            ['name' => 'blog.create', 'display_name' => 'Create Blog Posts', 'module' => 'Blog'],
            ['name' => 'blog.edit',   'display_name' => 'Edit Blog Posts',   'module' => 'Blog'],
            ['name' => 'blog.delete', 'display_name' => 'Delete Blog Posts', 'module' => 'Blog'],

            ['name' => 'faq.view',   'display_name' => 'View FAQ',   'module' => 'FAQ'],
            ['name' => 'faq.create', 'display_name' => 'Create FAQ', 'module' => 'FAQ'],
            ['name' => 'faq.edit',   'display_name' => 'Edit FAQ',   'module' => 'FAQ'],
            ['name' => 'faq.delete', 'display_name' => 'Delete FAQ', 'module' => 'FAQ'],

            ['name' => 'testimonials.view',   'display_name' => 'View Testimonials',   'module' => 'Testimonials'],
            ['name' => 'testimonials.create', 'display_name' => 'Create Testimonials', 'module' => 'Testimonials'],
            ['name' => 'testimonials.edit',   'display_name' => 'Edit Testimonials',   'module' => 'Testimonials'],
            ['name' => 'testimonials.delete', 'display_name' => 'Delete Testimonials', 'module' => 'Testimonials'],

            ['name' => 'investment.view',   'display_name' => 'View Investment',   'module' => 'Investment'],
            ['name' => 'investment.create', 'display_name' => 'Create Investment', 'module' => 'Investment'],
            ['name' => 'investment.edit',   'display_name' => 'Edit Investment',   'module' => 'Investment'],
            ['name' => 'investment.delete', 'display_name' => 'Delete Investment', 'module' => 'Investment'],

            ['name' => 'navigation.view',   'display_name' => 'View Navigation',   'module' => 'Navigation'],
            ['name' => 'navigation.create', 'display_name' => 'Create Navigation', 'module' => 'Navigation'],
            ['name' => 'navigation.edit',   'display_name' => 'Edit Navigation',   'module' => 'Navigation'],
            ['name' => 'navigation.delete', 'display_name' => 'Delete Navigation', 'module' => 'Navigation'],

            ['name' => 'settings.view', 'display_name' => 'View Settings', 'module' => 'Settings'],
            ['name' => 'settings.edit', 'display_name' => 'Edit Settings', 'module' => 'Settings'],

            ['name' => 'media.view',   'display_name' => 'View Media',   'module' => 'Media'],
            ['name' => 'media.upload', 'display_name' => 'Upload Media', 'module' => 'Media'],
            ['name' => 'media.delete', 'display_name' => 'Delete Media', 'module' => 'Media'],

            ['name' => 'project-updates.view',   'display_name' => 'View Project Updates',   'module' => 'Project Updates'],
            ['name' => 'project-updates.create', 'display_name' => 'Create Project Updates', 'module' => 'Project Updates'],
            ['name' => 'project-updates.edit',   'display_name' => 'Edit Project Updates',   'module' => 'Project Updates'],
            ['name' => 'project-updates.delete', 'display_name' => 'Delete Project Updates', 'module' => 'Project Updates'],
        ];

        foreach ($permissions as $p) {
            Permission::updateOrCreate(['name' => $p['name']], $p);
        }

        // super_admin role — no explicit permissions; bypasses all checks
        $superAdmin = Role::updateOrCreate(
            ['name' => 'super_admin'],
            ['display_name' => 'Super Admin', 'description' => 'Full system access, manages users and roles.']
        );

        // admin role — all content permissions
        $admin = Role::updateOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Admin', 'description' => 'Full content management access.']
        );
        $admin->permissions()->sync(Permission::all()->pluck('id'));

        // editor role — view/create/edit only (no delete, no settings)
        $editor = Role::updateOrCreate(
            ['name' => 'editor'],
            ['display_name' => 'Editor', 'description' => 'Can create and edit content but not delete.']
        );
        $editorPerms = Permission::where('name', 'not like', '%.delete')
            ->whereNotIn('name', ['settings.edit'])
            ->pluck('id');
        $editor->permissions()->sync($editorPerms);

        // Assign super_admin role to the seeded admin user
        $adminUser = User::where('email', 'admin@pandatowers.africa')->first();
        if ($adminUser) {
            $adminUser->roles()->syncWithoutDetaching([$superAdmin->id]);
        }
    }
}
