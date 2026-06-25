<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'site_name', 'value' => 'Panda Towers 001', 'type' => 'text', 'group' => 'general', 'label' => 'Site Name'],
            ['key' => 'site_tagline', 'value' => 'Plant The Seed to Your Legacy', 'type' => 'text', 'group' => 'general', 'label' => 'Tagline'],
            ['key' => 'logo', 'value' => '/Sky-Panda-Towers-Logo-1.png', 'type' => 'image', 'group' => 'branding', 'label' => 'Logo'],
            ['key' => 'logo_white', 'value' => '/Sky-Panda-Towers-Logo-1-removebg-preview.png', 'type' => 'image', 'group' => 'branding', 'label' => 'Logo (White/Transparent)'],
            ['key' => 'favicon', 'value' => '/favicon.png', 'type' => 'image', 'group' => 'branding', 'label' => 'Favicon'],
            ['key' => 'primary_color', 'value' => '#1a1f2e', 'type' => 'color', 'group' => 'branding', 'label' => 'Primary Color'],
            ['key' => 'accent_color', 'value' => '#c9a227', 'type' => 'color', 'group' => 'branding', 'label' => 'Accent Color'],
            // Contact
            ['key' => 'phone', 'value' => '+254 739 695 307', 'type' => 'text', 'group' => 'contact', 'label' => 'Phone Number'],
            ['key' => 'whatsapp', 'value' => '254739695307', 'type' => 'text', 'group' => 'contact', 'label' => 'WhatsApp Number'],
            ['key' => 'email', 'value' => 'invest@pandatowers.africa', 'type' => 'text', 'group' => 'contact', 'label' => 'Email Address'],
            ['key' => 'address', 'value' => 'Nairobi, Kenya', 'type' => 'text', 'group' => 'contact', 'label' => 'Address'],
            ['key' => 'address_detail', 'value' => '(Address to be updated)', 'type' => 'text', 'group' => 'contact', 'label' => 'Address Detail'],
            // SEO
            ['key' => 'meta_description', 'value' => 'Panda Towers 001 is a residential development offering affordable modern studios and 1-bedrooms along Waiyaki Way, Nairobi. Smart investment for rental income.', 'type' => 'text', 'group' => 'seo', 'label' => 'Default Meta Description'],
            ['key' => 'og_image', 'value' => '/panda-towers-render.jpg', 'type' => 'image', 'group' => 'seo', 'label' => 'Default OG Image'],
            // Links
            ['key' => 'brochure_url', 'value' => 'https://bit.ly/Panda001early', 'type' => 'text', 'group' => 'general', 'label' => 'Brochure URL'],
            ['key' => 'interest_form_url', 'value' => 'https://docs.google.com/forms/d/e/1FAIpQLSfBDzGGhflXOVTY07btM-kuvhX9a1ZbQBrebpu5CwAdRWMAbQ/viewform?embedded=true', 'type' => 'text', 'group' => 'general', 'label' => 'Interest Form URL'],
            ['key' => 'footer_description', 'value' => 'Premium residential investment designed for long-term passive rental income. Your pathway to financial freedom.', 'type' => 'text', 'group' => 'general', 'label' => 'Footer Description'],
            ['key' => 'copyright_text', 'value' => 'Panda Towers 001. All rights reserved.', 'type' => 'text', 'group' => 'general', 'label' => 'Copyright Text'],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
