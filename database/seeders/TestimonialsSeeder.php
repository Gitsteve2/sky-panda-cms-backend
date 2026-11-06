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
                'email' => 'sarah.wanjiku@example.com',
                'phone' => '+254 722 100 200',
                'company' => 'Wanjiku Holdings Ltd',
                'role' => 'Property Investor',
                'location' => 'Nairobi, Kenya',
                'avatar' => '/static image.jpg',
                'testimonial' => 'Panda Towers 001 exceeded my expectations. The rental yields are exactly as promised, and the property management team is exceptional. My investment has been performing beautifully.',
                'photos' => json_encode(['/exterior.jpg', '/1 bedroom.jpg']),
                'rating' => 5.0,
                'investment_amount' => 'KES 8.5M',
                'monthly_income' => 'KES 68,000',
                'years_investing' => 2,
                'order' => 1,
                'status' => 'approved',
                'is_active' => true,
                'source' => 'cms',
                'approved_at' => now()->subHours(10),
                'created_at' => now()->subHours(10),
                'updated_at' => now()->subHours(10),
            ],
            [
                'name' => 'David Kiprop',
                'email' => 'david.kiprop@example.com',
                'phone' => '+254 733 200 300',
                'company' => 'Rift Valley Developments',
                'role' => 'Real Estate Developer',
                'location' => 'Nakuru, Kenya',
                'avatar' => '/1 bedroom.jpg',
                'testimonial' => 'As someone in the real estate industry, I know quality when I see it. Panda Towers 001 represents the future of residential investment in Kenya. The construction quality and tenant profile are outstanding.',
                'photos' => null,
                'rating' => 4.5,
                'investment_amount' => 'KES 15M',
                'monthly_income' => 'KES 120,000',
                'years_investing' => 3,
                'order' => 2,
                'status' => 'approved',
                'is_active' => true,
                'source' => 'cms',
                'approved_at' => now()->subDays(2),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'name' => 'Grace Achieng',
                'email' => 'grace.achieng@example.com',
                'phone' => null,
                'company' => 'Apex Wealth Advisory',
                'role' => 'Financial Advisor',
                'location' => 'Kisumu, Kenya',
                'avatar' => '/2-bedroom-apartment.jpg',
                'testimonial' => "I've recommended Panda Towers 001 to several of my clients. The returns are consistent, the management is professional, and the appreciation potential is significant. A truly smart project.",
                'photos' => null,
                'rating' => 5.0,
                'investment_amount' => 'KES 12M',
                'monthly_income' => 'KES 96,000',
                'years_investing' => 1,
                'order' => 3,
                'status' => 'approved',
                'is_active' => true,
                'source' => 'cms',
                'approved_at' => now()->subDays(6),
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(6),
            ],
            [
                'name' => 'James Mwangi',
                'email' => 'james.mwangi@example.com',
                'phone' => '+254 711 400 500',
                'company' => null,
                'role' => 'Site Visitor & Prospective Buyer',
                'location' => 'Westlands, Nairobi',
                'avatar' => '/exterior.jpg',
                'testimonial' => 'Visited the Kinoo site along Waiyaki Way last weekend. The accessibility to Westlands and the clarity of the architectural plans really stood out to me.',
                'photos' => json_encode(['/tower.jpg']),
                'rating' => 4.5,
                'investment_amount' => null,
                'monthly_income' => null,
                'years_investing' => 1,
                'order' => 4,
                'status' => 'approved',
                'is_active' => true,
                'source' => 'website',
                'approved_at' => now()->subDays(14),
                'created_at' => now()->subDays(14),
                'updated_at' => now()->subDays(14),
            ],
            [
                'name' => 'Dr. Amina Hassan',
                'email' => 'amina.hassan@example.com',
                'phone' => '+254 720 800 900',
                'company' => 'Coast Medical Specialists',
                'role' => 'Medical Consultant',
                'location' => 'Mombasa, Kenya',
                'avatar' => '/tower.jpg',
                'testimonial' => "Kinoo's proximity to Westlands made Panda Towers an easy choice for my retirement portfolio. Reserving a 1-bedroom executive unit was straightforward and the advisory desk was very helpful.",
                'photos' => null,
                'rating' => 5.0,
                'investment_amount' => 'KES 3.7M',
                'monthly_income' => 'KES 29,000',
                'years_investing' => 1,
                'order' => 5,
                'status' => 'approved',
                'is_active' => true,
                'source' => 'cms',
                'approved_at' => now()->subDays(35),
                'created_at' => now()->subDays(35),
                'updated_at' => now()->subDays(35),
            ],
        ];

        foreach ($testimonials as $t) {
            DB::table('testimonials')->insert($t);
        }
    }
}
