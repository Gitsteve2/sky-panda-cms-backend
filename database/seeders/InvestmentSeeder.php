<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvestmentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('unit_types')->truncate();
        DB::table('amenities')->truncate();

        $units = [
            [
                'type' => 'Studio',
                'size' => '23 sqm',
                'bedrooms' => 0,
                'bathrooms' => 1,
                'price_label' => 'KES 2.9M',
                'price_value' => 2900000,
                'all_cash_price' => 2350000,
                'booking_fee' => 150000,
                'monthly_rent_label' => 'KES 16,500',
                'monthly_rent_value' => 16500,
                'yield_range' => '7.9 - 9%',
                'total_units' => 100,
                'available_units' => 74,
                'featured_image' => '/studio.jpg',
                'gallery' => json_encode(['/studio.jpg', '/1_1 - Photo.jpg', '/1_7 - Photo.jpg', '/1_11 - Photo.jpg']),
                'features' => json_encode(['Balcony', 'Fitted Kitchen', 'Bathroom', 'Bedroom with storage space']),
                'order' => 1,
                'is_active' => true,
            ],
            [
                'type' => '1 Bedroom',
                'size' => '43 sqm',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'price_label' => 'KES 3.95M',
                'price_value' => 3950000,
                'all_cash_price' => 3500000,
                'booking_fee' => 200000,
                'monthly_rent_label' => 'KES 28,000',
                'monthly_rent_value' => 28000,
                'yield_range' => '9 - 10%',
                'total_units' => 40,
                'available_units' => 26,
                'featured_image' => '/1bedroom-4.jpg',
                'gallery' => json_encode(['/1-bedroom.jpg', '/1_1 - Photo.jpg', '/1_7 - Photo.jpg', '/1_12 - Photo.jpg']),
                'features' => json_encode(['Balcony', 'Fitted Kitchen', 'Bathroom', 'Living space', 'Bedroom with storage space']),
                'order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($units as $unit) {
            DB::table('unit_types')->insert(array_merge($unit, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $amenities = [
            ['name' => 'Rooftop Garden', 'image' => '/exterior.jpg', 'icon' => 'Trees', 'order' => 1],
            ['name' => 'Laundry Area', 'image' => '/tower2.jpg', 'icon' => 'WashingMachine', 'order' => 2],
            ['name' => '24/7 Security & CCTV', 'image' => '/24_7 Security with CCTV.webp', 'icon' => 'Shield', 'order' => 3],
            ['name' => 'High-Speed Lifts', 'image' => '/Elevators.jpg', 'icon' => 'ArrowUpDown', 'order' => 4],
            ['name' => 'Fibre Connectivity', 'image' => '/High-Speed Internet Ready.webp', 'icon' => 'Wifi', 'order' => 5],
            ['name' => 'Common Area Backup Generator', 'image' => '/Backup Generator.jpg', 'icon' => 'Zap', 'order' => 6],
            ['name' => 'Ample Parking', 'image' => '/Ample Parking.webp', 'icon' => 'Car', 'order' => 7],
            ['name' => 'Biometric Access Control', 'image' => '/tower3.jpg', 'icon' => 'Fingerprint', 'order' => 8],
        ];

        foreach ($amenities as $amenity) {
            DB::table('amenities')->insert(array_merge($amenity, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
