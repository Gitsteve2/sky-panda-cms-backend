<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavigationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('navigation_items')->truncate();

        $items = [
            ['label' => 'Home', 'path' => '/', 'order' => 1],
            ['label' => 'About', 'path' => '/about', 'order' => 2],
            ['label' => 'Investment', 'path' => '/investment', 'order' => 3],
            ['label' => 'Calculator', 'path' => '/calculator', 'order' => 4],
            ['label' => 'Blog', 'path' => '/blog', 'order' => 5],
            ['label' => 'FAQ', 'path' => '/faq', 'order' => 6],
            ['label' => 'Contact', 'path' => '/contact', 'order' => 7],
        ];

        foreach ($items as $item) {
            DB::table('navigation_items')->insert(array_merge($item, [
                'type' => 'internal',
                'target' => '_self',
                'is_active' => true,
                'show_in_mobile' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
