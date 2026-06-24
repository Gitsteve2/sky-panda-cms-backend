<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('blog_posts')->truncate();
        DB::table('blog_categories')->truncate();

        $categories = [
            ['name' => 'Investment Strategy', 'slug' => 'investment-strategy', 'color' => '#3B82F6', 'order' => 1],
            ['name' => 'Market Analysis', 'slug' => 'market-analysis', 'color' => '#10B981', 'order' => 2],
            ['name' => 'Property Investment', 'slug' => 'property-investment', 'color' => '#F59E0B', 'order' => 3],
            ['name' => 'Tax & Legal', 'slug' => 'tax-legal', 'color' => '#EF4444', 'order' => 4],
        ];

        $categoryIds = [];
        foreach ($categories as $cat) {
            $id = DB::table('blog_categories')->insertGetId(array_merge($cat, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            $categoryIds[$cat['slug']] = $id;
        }

        $posts = [
            [
                'title' => 'Why Real Estate Investment Remains King',
                'slug' => 'why-real-estate-investment-remains-king',
                'excerpt' => 'Discover why real estate continues to be one of the most reliable investment vehicles, especially in emerging markets like Kenya.',
                'content' => '<p>Real estate has long been considered one of the most reliable investment vehicles across the globe. In Kenya, the property market continues to demonstrate resilience, offering investors consistent returns and capital appreciation over time.</p><h2>Stability in Volatile Times</h2><p>Unlike stocks or cryptocurrency, real estate provides a tangible asset that retains intrinsic value. Even during economic downturns, property values tend to recover and appreciate over the long term.</p><h2>Rental Income as Passive Revenue</h2><p>Investment properties like units in Panda Towers 001 generate consistent monthly rental income, creating a reliable passive revenue stream that can supplement or replace employment income.</p><h2>Capital Appreciation</h2><p>Properties in strategic locations along major roads like Waiyaki Way have historically appreciated significantly, delivering capital gains to long-term investors.</p>',
                'featured_image' => '/static image.jpg',
                'read_time' => '5 min read',
                'blog_category_id' => $categoryIds['investment-strategy'],
                'is_featured' => true,
                'is_published' => true,
                'published_at' => '2025-11-01 08:00:00',
                'order' => 1,
            ],
            [
                'title' => 'Understanding Rental Yields: What to Expect in Nairobi',
                'slug' => 'understanding-rental-yields-nairobi',
                'excerpt' => 'A comprehensive guide to rental yields in Nairobi\'s property market and how to maximize your returns.',
                'content' => '<p>Rental yield is one of the most important metrics for property investors. In Nairobi, understanding what constitutes a good yield can help you make informed investment decisions.</p><h2>What is Rental Yield?</h2><p>Rental yield is the annual rental income expressed as a percentage of the property value. A gross yield of 7-10% is considered excellent in the Nairobi market.</p><h2>Panda Towers 001 Yields</h2><p>Studios at Panda Towers 001 offer 7.9-9% gross yield while 1-bedroom units offer 9-10%, well above the Nairobi market average of 5-7%.</p>',
                'featured_image' => '/nyeri.jpg',
                'read_time' => '7 min read',
                'blog_category_id' => $categoryIds['market-analysis'],
                'is_featured' => false,
                'is_published' => true,
                'published_at' => '2025-10-28 08:00:00',
                'order' => 2,
            ],
            [
                'title' => 'The Benefits of Investing in Premium Residential Properties',
                'slug' => 'benefits-investing-premium-residential-properties',
                'excerpt' => 'Why premium properties offer better long-term value and how Panda Towers 001 fits into this strategy.',
                'content' => '<p>Premium residential properties consistently outperform budget alternatives when measured over a 5-10 year horizon. The quality of construction, location, and amenities attract better tenants and command higher rents.</p><h2>Better Tenant Quality</h2><p>Premium properties attract professionals and expatriates who pay higher rents and take better care of the property.</p><h2>Lower Vacancy Rates</h2><p>Well-located premium developments like Panda Towers 001 along Waiyaki Way maintain near-100% occupancy due to consistent demand from professionals working in Westlands and CBD.</p>',
                'featured_image' => '/2-bedroom-apartment.jpg',
                'read_time' => '4 min read',
                'blog_category_id' => $categoryIds['property-investment'],
                'is_featured' => false,
                'is_published' => true,
                'published_at' => '2025-10-25 08:00:00',
                'order' => 3,
            ],
            [
                'title' => 'Tax Benefits for Real Estate Investors in Kenya',
                'slug' => 'tax-benefits-real-estate-investors-kenya',
                'excerpt' => 'Understanding the tax advantages and incentives available to property investors in Kenya.',
                'content' => '<p>Kenya\'s tax framework provides several incentives for real estate investors that can significantly improve your after-tax returns when structured correctly.</p><h2>Rental Income Tax</h2><p>Residential rental income is taxed at a flat rate of 10% on gross receipts (for annual income between KES 288,000 and KES 15M) under the Monthly Rental Income (MRI) tax regime.</p><h2>Stamp Duty</h2><p>Stamp duty of 4% is payable on property purchases. This is a one-time cost that can be planned for in your investment budget.</p><h2>Capital Gains Tax</h2><p>Property gains are subject to CGT at 5% of the net gain on disposal, which is relatively low compared to other investment classes.</p>',
                'featured_image' => '/3 bed.webp',
                'read_time' => '6 min read',
                'blog_category_id' => $categoryIds['tax-legal'],
                'is_featured' => false,
                'is_published' => true,
                'published_at' => '2025-10-20 08:00:00',
                'order' => 4,
            ],
        ];

        foreach ($posts as $post) {
            DB::table('blog_posts')->insert(array_merge($post, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
