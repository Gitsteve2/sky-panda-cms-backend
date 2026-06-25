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
            ['key' => 'site_name',    'value' => 'Panda Towers 001',                   'type' => 'text',  'group' => 'general',  'label' => 'Site Name'],
            ['key' => 'tagline',      'value' => 'Plant The Seed to Your Legacy',        'type' => 'text',  'group' => 'general',  'label' => 'Tagline'],
            ['key' => 'brochure_url', 'value' => 'https://bit.ly/Panda001early',         'type' => 'text',  'group' => 'general',  'label' => 'Brochure URL'],
            ['key' => 'interest_form_url', 'value' => 'https://docs.google.com/forms/d/e/1FAIpQLSfBDzGGhflXOVTY07btM-kuvhX9a1ZbQBrebpu5CwAdRWMAbQ/viewform?embedded=true', 'type' => 'text', 'group' => 'general', 'label' => 'Interest Form URL'],
            ['key' => 'footer_description', 'value' => 'Premium residential investment designed for long-term passive rental income. Your pathway to financial freedom.', 'type' => 'text', 'group' => 'general', 'label' => 'Footer Description'],
            ['key' => 'copyright_text',     'value' => 'Panda Towers 001. All rights reserved.',                                                                              'type' => 'text', 'group' => 'general', 'label' => 'Copyright Text'],

            // Branding
            ['key' => 'logo_url',       'value' => '/Sky-Panda-Towers-Logo-1.png',                'type' => 'image', 'group' => 'branding', 'label' => 'Logo'],
            ['key' => 'logo_white_url', 'value' => '/Sky-Panda-Towers-Logo-1-removebg-preview.png', 'type' => 'image', 'group' => 'branding', 'label' => 'Logo (White/Transparent)'],
            ['key' => 'favicon',        'value' => '/favicon.png',                                 'type' => 'image', 'group' => 'branding', 'label' => 'Favicon'],
            ['key' => 'primary_color',  'value' => '#1a1f2e',                                      'type' => 'color', 'group' => 'branding', 'label' => 'Primary Color'],
            ['key' => 'accent_color',   'value' => '#c9a227',                                      'type' => 'color', 'group' => 'branding', 'label' => 'Accent Color'],

            // Contact
            ['key' => 'phone',          'value' => '+254 739 695 307',            'type' => 'text', 'group' => 'contact', 'label' => 'Phone Number'],
            ['key' => 'whatsapp',       'value' => '254739695307',                'type' => 'text', 'group' => 'contact', 'label' => 'WhatsApp Number'],
            ['key' => 'email',          'value' => 'invest@pandatowers.africa',   'type' => 'text', 'group' => 'contact', 'label' => 'Email Address'],
            ['key' => 'address',        'value' => 'Nairobi, Kenya',              'type' => 'text', 'group' => 'contact', 'label' => 'Address'],
            ['key' => 'address_detail', 'value' => 'Kinoo, Waiyaki Way, Nairobi','type' => 'text', 'group' => 'contact', 'label' => 'Address Detail'],

            // SEO
            ['key' => 'meta_description', 'value' => 'Panda Towers 001 is a residential development offering affordable modern studios and 1-bedrooms along Waiyaki Way, Nairobi. Smart investment for rental income.', 'type' => 'text',  'group' => 'seo', 'label' => 'Default Meta Description'],
            ['key' => 'og_image',         'value' => '/panda-towers-render.jpg',                                                                                                                                                          'type' => 'image', 'group' => 'seo', 'label' => 'Default OG Image'],

            // Calculator
            ['key' => 'calculator_heading',       'value' => 'Investment Calculator',                                                                                       'type' => 'text',    'group' => 'calculator', 'label' => 'Calculator Heading'],
            ['key' => 'calculator_subheading',    'value' => 'Estimate your potential passive income with Panda Towers 001',                                                 'type' => 'text',    'group' => 'calculator', 'label' => 'Calculator Subheading'],
            ['key' => 'calculator_default_price', 'value' => '3950000',                                                                                                     'type' => 'number',  'group' => 'calculator', 'label' => 'Default Unit Price'],
            ['key' => 'calculator_default_dp',    'value' => '30',                                                                                                          'type' => 'number',  'group' => 'calculator', 'label' => 'Default Down Payment %'],
            ['key' => 'calculator_default_yield', 'value' => '9',                                                                                                           'type' => 'number',  'group' => 'calculator', 'label' => 'Default Yield %'],
            ['key' => 'calculator_dp_options',    'value' => '30,50,100',                                                                                                   'type' => 'text',    'group' => 'calculator', 'label' => 'DP Options (comma-separated %)'],
            ['key' => 'calculator_cta_text',      'value' => 'See our Brochure',                                                                                            'type' => 'text',    'group' => 'calculator', 'label' => 'Primary CTA Text'],
            ['key' => 'calculator_cta_url',       'value' => 'https://online.fliphtml5.com/gngqe/fdnx/',                                                                    'type' => 'text',    'group' => 'calculator', 'label' => 'Primary CTA URL'],
            ['key' => 'calculator_whatsapp',      'value' => '254739695307',                                                                                                'type' => 'text',    'group' => 'calculator', 'label' => 'WhatsApp Number for Calculator'],
            ['key' => 'calculator_disclaimer',    'value' => '* These are estimates based on current market conditions. Actual returns may vary. All figures are subject to change and should be verified with our sales team.', 'type' => 'textarea', 'group' => 'calculator', 'label' => 'Disclaimer Text'],

            // Location / Map
            ['key' => 'location_heading',     'value' => 'Strategic Location',                                                                                                                                                                                               'type' => 'text',    'group' => 'location', 'label' => 'Section Heading'],
            ['key' => 'location_address',     'value' => 'Kinoo, Waiyaki Way, Nairobi',                                                                                                                                                                                      'type' => 'text',    'group' => 'location', 'label' => 'Address'],
            ['key' => 'location_description', 'value' => 'Panda Towers 001 enjoys unparalleled connectivity, minutes from major business hubs and lifestyle amenities.',                                                                                                      'type' => 'textarea','group' => 'location', 'label' => 'Description'],
            ['key' => 'location_embed_url',   'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819!2d36.691414!3d-1.253637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTUnMTMuMSJTIDM2wrA0MSczNi45IkU!5e0!3m2!1sen!2ske!4v1699999999999!5m2!1sen!2ske', 'type' => 'text', 'group' => 'location', 'label' => 'Google Maps Embed URL'],
            ['key' => 'location_map_image',   'value' => '/sky-map.png',                                                                                                                                                                                                     'type' => 'image',   'group' => 'location', 'label' => 'Static Map Image'],
            ['key' => 'location_highlights',  'value' => "10 km|from ABC Place\n20 mins|to Westlands CBD\n25 mins|to Lavington\n30 mins|to Gigiri",                                                                                                                          'type' => 'textarea','group' => 'location', 'label' => 'Proximity Highlights (value|label per line)'],

            // Project progress
            ['key' => 'project_overall_progress',    'value' => '25',                'type' => 'number', 'group' => 'project', 'label' => 'Overall Progress (%)'],
            ['key' => 'project_expected_completion', 'value' => 'Q4 2026',           'type' => 'text',   'group' => 'project', 'label' => 'Expected Completion'],
            ['key' => 'project_schedule_status',     'value' => 'Pre-Construction',  'type' => 'text',   'group' => 'project', 'label' => 'Schedule Status'],
            ['key' => 'project_total_units',         'value' => '140',               'type' => 'number', 'group' => 'project', 'label' => 'Total Units'],
            ['key' => 'project_sold_units',          'value' => '46',                'type' => 'number', 'group' => 'project', 'label' => 'Units Sold'],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
