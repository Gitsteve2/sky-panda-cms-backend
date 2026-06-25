<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PagesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('page_sections')->truncate();
        DB::table('pages')->truncate();

        $pages = [
            ['title' => 'Home',       'slug' => 'home',       'description' => 'Main landing page for Panda Towers 001',          'meta_title' => 'Panda Towers 001 - Plant The Seed to Your Legacy',      'meta_description' => 'Invest in affordable modern studios and 1-bedrooms along Waiyaki Way.', 'og_image' => '/panda-towers-render.jpg', 'is_published' => true, 'is_system' => true],
            ['title' => 'About',      'slug' => 'about',      'description' => 'About Panda Towers 001 and its developers',        'meta_title' => 'About Panda Towers 001 - Our Story',                    'meta_description' => 'Learn about Panda Towers 001, a flagship project by Kenyan real estate veterans.',     'og_image' => '/panda-towers-render.jpg', 'is_published' => true, 'is_system' => true],
            ['title' => 'Investment', 'slug' => 'investment', 'description' => 'Investment details, unit types and pricing',       'meta_title' => 'Investment Opportunities - Panda Towers 001',           'meta_description' => 'Explore studio and 1-bedroom investment opportunities with 7-10% rental yields.', 'og_image' => '/exterior.jpg',            'is_published' => true, 'is_system' => true],
            ['title' => 'Blog',       'slug' => 'blog',       'description' => 'Real estate investment insights and news',         'meta_title' => 'Real Estate Investment Blog - Panda Towers 001',        'meta_description' => 'Expert insights and investment strategies for real estate.',                        'og_image' => '/panda-towers-render.jpg', 'is_published' => true, 'is_system' => true],
            ['title' => 'FAQ',        'slug' => 'faq',        'description' => 'Frequently asked questions',                       'meta_title' => 'FAQ - Panda Towers 001',                                'meta_description' => 'Everything you need to know about investing in Panda Towers 001.',                  'og_image' => '/panda-towers-render.jpg', 'is_published' => true, 'is_system' => true],
            ['title' => 'Contact',    'slug' => 'contact',    'description' => 'Contact Panda Towers 001 team',                   'meta_title' => 'Contact Us - Panda Towers 001',                         'meta_description' => 'Get in touch with the Panda Towers 001 team.',                                      'og_image' => '/panda-towers-render.jpg', 'is_published' => true, 'is_system' => true],
            ['title' => 'Updates',    'slug' => 'updates',    'description' => 'Project progress updates and construction milestones', 'meta_title' => 'Project Updates - Panda Towers 001',               'meta_description' => 'Track the construction progress of Panda Towers 001.',                              'og_image' => '/panda-towers-render.jpg', 'is_published' => true, 'is_system' => true],
        ];

        foreach ($pages as $page) {
            $pageId = DB::table('pages')->insertGetId(array_merge($page, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));

            if ($page['slug'] === 'home') {
                $this->seedHomeSections($pageId);
            }
        }
    }

    private function seedHomeSections(int $pageId): void
    {
        $sections = [
            [
                'page_id'      => $pageId,
                'name'         => 'Hero',
                'section_type' => 'hero',
                'content'      => json_encode([
                    'badge_text'        => 'Early Access Preview',
                    'heading'           => 'Plant The Seed to',
                    'heading_highlight' => 'Your Legacy',
                    'subheading'        => 'Panda Towers 001 is a residential development project made up of affordable, modern studios and 1-bedrooms along Waiyaki Way for sale. Designed to generate attractive returns for investors who want to add rental income into their investment portfolio.',
                    'cta_text'          => 'See Our Brochure',
                    'cta_url'           => 'https://bit.ly/Panda001early',
                    'cta_target'        => '_blank',
                    'secondary_cta_text'=> 'View Investment Units',
                    'secondary_cta_url' => '/investment',
                    'background_type'   => 'video',
                    'background_src'    => '/EXT PANDA 01_3.mp4',
                    'background_poster' => '/static image.jpg',
                ]),
                'order'     => 1,
                'is_active' => true,
            ],
            [
                'page_id'      => $pageId,
                'name'         => 'Key Benefits',
                'section_type' => 'cards',
                'content'      => json_encode([
                    'heading'    => 'Panda Towers 001 Insights',
                    'subheading' => 'Harnessing the Swahili word for "to plant" and "to climb" (Panda), and referencing the free, fun loving black & white bear commonly found in China, Panda Towers 001 represents an opportunity to build financial freedom. This is an ascent in investment potential, quality living, and community design. We are creating a landmark development that is perfect for investors who want to add rental property to their investment portfolio.',
                    'cards'      => [
                        ['icon' => 'TrendingUp', 'label' => 'Smart Investment',        'description' => 'A high-demand, off-plan opportunity engineered for strong rental yields and significant capital appreciation in a strategic, high-growth area.'],
                        ['icon' => 'Home',       'label' => 'Modern Urban Living',     'description' => "Tastefully designed studios and one-bedroom units with comfortable finishes and modern amenities, perfect for today's professionals."],
                        ['icon' => 'Users',      'label' => 'Community & Convenience', 'description' => 'A secure, connected ecosystem featuring recreation zones, biometric access, and shared facilities that foster a vibrant community life.'],
                    ],
                ]),
                'order'     => 2,
                'is_active' => true,
            ],
            [
                'page_id'      => $pageId,
                'name'         => 'Why Invest',
                'section_type' => 'why_invest',
                'content'      => json_encode([
                    'badge'      => 'Built for Investors',
                    'heading'    => 'Prime Location, Superior Returns',
                    'subheading' => 'Panda Towers 001 is a residential development project made up of affordable, modern studios and 1-bedrooms along Waiyaki Way for sale. Designed to generate attractive returns for investors who want to add rental income into their investment portfolio.',
                    'cta_text'   => 'View All Investment Options',
                    'cta_url'    => '/investment',
                    'bullet_points' => [
                        'High growth corridor: Proven capital appreciation potential',
                        'High rental demand from professionals ensuring steady returns',
                        'Unmatched connectivity to Nairobi CBD and Westlands',
                        'Lifestyle amenities including shopping centers, schools, and healthcare',
                    ],
                    'images' => [
                        ['image' => '/towers1.jpg',  'title' => 'PANDA 001',        'subtitle' => 'Modern & Efficient'],
                        ['image' => '/1bd.jpg',       'title' => '1 BEDROOM UNITS', 'subtitle' => 'Perfect for Professionals'],
                        ['image' => '/studio5.jpg',   'title' => 'STUDIO UNIT',     'subtitle' => 'Perfect for Professionals'],
                    ],
                ]),
                'order'     => 3,
                'is_active' => true,
            ],
            [
                'page_id'      => $pageId,
                'name'         => 'Testimonials',
                'section_type' => 'testimonials',
                'content'      => json_encode([
                    'heading'         => 'What Our Investors Say',
                    'subheading'      => 'Real stories from investors building wealth with Panda Towers 001',
                    'badge'           => 'Investor Success Stories',
                    'cta_heading'     => 'Join 150+ Successful Investors',
                    'cta_subheading'  => 'Secure your financial future with Panda Towers 001',
                ]),
                'order'     => 4,
                'is_active' => true,
            ],
            [
                'page_id'      => $pageId,
                'name'         => 'Call to Action',
                'section_type' => 'cta',
                'content'      => json_encode([
                    'heading'           => 'Ready to Plant Your Seed?',
                    'subheading'        => 'Join hundreds of investors building wealth with Panda Towers 001. Limited units available.',
                    'primary_cta_text'  => 'Book Your Unit Now',
                    'primary_cta_url'   => 'https://docs.google.com/forms/d/e/1FAIpQLSfBDzGGhflXOVTY07btM-kuvhX9a1ZbQBrebpu5CwAdRWMAbQ/viewform?embedded=true',
                    'secondary_cta_text'=> 'WhatsApp Us',
                    'secondary_cta_url' => 'https://wa.me/254739695307',
                    'background_color'  => '#1a1f2e',
                ]),
                'order'     => 5,
                'is_active' => true,
            ],
        ];

        foreach ($sections as $section) {
            DB::table('page_sections')->insert(array_merge($section, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
