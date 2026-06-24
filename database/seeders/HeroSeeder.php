<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HeroSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('hero_slides')->truncate();

        DB::table('hero_slides')->insert([
            'badge_text' => 'Early Access Preview',
            'heading' => 'Plant The Seed to',
            'heading_highlight' => 'Your Legacy',
            'subheading' => 'Panda Towers 001 is a residential development project made up of affordable, modern studios and 1-bedrooms along Waiyaki Way for sale. Designed to generate attractive returns for investors who want to add rental income into their investment portfolio.',
            'cta_text' => 'See Our Brochure',
            'cta_url' => 'https://bit.ly/Panda001early',
            'cta_target' => '_blank',
            'background_type' => 'video',
            'background_src' => '/EXT PANDA 01_3.mp4',
            'background_poster' => '/static image.jpg',
            'overlay_color' => 'rgba(0,0,0,0.4)',
            'order' => 1,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
