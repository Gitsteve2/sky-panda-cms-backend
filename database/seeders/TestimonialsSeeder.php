<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestimonialsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('testimonials')->truncate();

        $testimonials = [
            [
                'name' => 'Sarah Wanjiku',
                'role' => 'Property Investor',
                'location' => 'Nairobi, Kenya',
                'avatar' => '/static image.jpg',
                'testimonial' => 'Panda Towers 001 exceeded my expectations. The rental yields are exactly as promised, and the property management team is exceptional. My investment has been performing beautifully.',
                'rating' => 5,
                'investment_amount' => 'KES 8.5M',
                'monthly_income' => 'KES 68,000',
                'years_investing' => 2,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'David Kiprop',
                'role' => 'Real Estate Developer',
                'location' => 'Nakuru, Kenya',
                'avatar' => '/1 bedroom.jpg',
                'testimonial' => 'As someone in the real estate industry, I know quality when I see it. Panda Towers 001 represents the future of residential investment in Kenya. The construction quality and tenant profile are outstanding.',
                'rating' => 5,
                'investment_amount' => 'KES 15M',
                'monthly_income' => 'KES 120,000',
                'years_investing' => 3,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Grace Achieng',
                'role' => 'Financial Advisor',
                'location' => 'Kisumu, Kenya',
                'avatar' => '/2-bedroom-apartment.jpg',
                'testimonial' => "I've recommended Panda Towers 001 to several of my high-net-worth clients. The returns are consistent, the management is professional, and the appreciation potential is significant. A truly smart investment.",
                'rating' => 5,
                'investment_amount' => 'KES 12M',
                'monthly_income' => 'KES 96,000',
                'years_investing' => 1,
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $t) {
            DB::table('testimonials')->insert(array_merge($t, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
