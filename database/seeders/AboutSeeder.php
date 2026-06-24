<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AboutSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('track_records')->truncate();
        DB::table('core_values')->truncate();

        $trackRecords = [
            [
                'title' => 'Residential, Embakasi, Pipeline',
                'description' => '200+ affordable housing units',
                'icon' => 'Building2',
                'image' => '/embakasi.jpg',
                'order' => 1,
            ],
            [
                'title' => 'Single Family Homes, Kitengela',
                'description' => '12 single-family home gated community',
                'icon' => 'Home',
                'image' => '/kitengela.jpg',
                'order' => 2,
            ],
            [
                'title' => 'Multi-Use, Skuta, Nyeri',
                'description' => '112 units: commercial, residential and hospitality',
                'icon' => 'Users',
                'image' => '/nyeri.jpg',
                'order' => 3,
            ],
            [
                'title' => 'Warehouse, Kikuyu, Kiambu',
                'description' => '10,000 sqft warehouse space',
                'icon' => 'Warehouse',
                'image' => '/kikuyu.jpg',
                'order' => 4,
            ],
        ];

        foreach ($trackRecords as $record) {
            DB::table('track_records')->insert(array_merge($record, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $coreValues = [
            [
                'title' => 'Transparency',
                'description' => 'Clear pricing, honest communication, and full disclosure at every step.',
                'icon' => 'Shield',
                'icon_color' => '#15803d',
                'order' => 1,
            ],
            [
                'title' => 'Investor Success',
                'description' => 'Your returns are our priority. We succeed when you succeed.',
                'icon' => 'Heart',
                'icon_color' => '#15803d',
                'order' => 2,
            ],
            [
                'title' => 'Quality',
                'description' => 'Premium materials, expert craftsmanship, and attention to detail.',
                'icon' => 'Award',
                'icon_color' => '#15803d',
                'order' => 3,
            ],
            [
                'title' => 'Trust',
                'description' => 'Building lasting relationships through reliability and integrity.',
                'icon' => 'Handshake',
                'icon_color' => '#15803d',
                'order' => 4,
            ],
        ];

        foreach ($coreValues as $value) {
            DB::table('core_values')->insert(array_merge($value, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
