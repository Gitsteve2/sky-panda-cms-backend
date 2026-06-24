<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatsAndSocialSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('stats')->truncate();
        DB::table('social_links')->truncate();

        $stats = [
            [
                'group' => 'testimonials',
                'icon' => 'Users',
                'value' => '150+',
                'label' => 'Happy Investors',
                'description' => 'Satisfied property owners',
                'order' => 1,
            ],
            [
                'group' => 'testimonials',
                'icon' => 'TrendingUp',
                'value' => '12%',
                'label' => 'Average Yield',
                'description' => 'Consistent rental returns',
                'order' => 2,
            ],
            [
                'group' => 'testimonials',
                'icon' => 'Shield',
                'value' => '100%',
                'label' => 'Occupancy Rate',
                'description' => 'Fully occupied units',
                'order' => 3,
            ],
            [
                'group' => 'investment',
                'icon' => 'TrendingUp',
                'value' => '9%',
                'label' => 'Gross Rental Yield',
                'description' => 'Average annual rental yield',
                'order' => 1,
            ],
            [
                'group' => 'investment',
                'icon' => 'Calendar',
                'value' => '24 Months',
                'label' => 'Payment Plan',
                'description' => 'Flexible off-plan payment',
                'order' => 2,
            ],
            [
                'group' => 'investment',
                'icon' => 'Building2',
                'value' => '140',
                'label' => 'Total Units',
                'description' => '100 studios + 40 one-bedrooms',
                'order' => 3,
            ],
            [
                'group' => 'investment',
                'icon' => 'MapPin',
                'value' => 'Kinoo',
                'label' => 'Location',
                'description' => 'Along Waiyaki Way',
                'order' => 4,
            ],
            [
                'group' => 'general',
                'icon' => 'Award',
                'value' => '30+',
                'label' => 'Years Experience',
                'description' => 'Consortium of seasoned developers',
                'order' => 1,
            ],
        ];

        foreach ($stats as $stat) {
            DB::table('stats')->insert(array_merge($stat, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $socialLinks = [
            ['platform' => 'facebook', 'label' => 'Facebook', 'url' => 'https://facebook.com', 'icon' => 'Facebook', 'order' => 1],
            ['platform' => 'twitter', 'label' => 'Twitter', 'url' => 'https://twitter.com', 'icon' => 'Twitter', 'order' => 2],
            ['platform' => 'instagram', 'label' => 'Instagram', 'url' => 'https://instagram.com', 'icon' => 'Instagram', 'order' => 3],
            ['platform' => 'linkedin', 'label' => 'LinkedIn', 'url' => 'https://linkedin.com', 'icon' => 'Linkedin', 'order' => 4],
            ['platform' => 'whatsapp', 'label' => 'WhatsApp', 'url' => 'https://wa.me/254739695307?text=Hi,%20I\'m%20interested%20in%20Sky%20Panda%20Towers', 'icon' => 'MessageCircle', 'order' => 5],
        ];

        foreach ($socialLinks as $link) {
            DB::table('social_links')->insert(array_merge($link, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
