<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('faq_items')->truncate();
        DB::table('faq_categories')->truncate();

        $categories = [
            ['name' => 'Project Overview', 'slug' => 'project-overview', 'order' => 1],
            ['name' => 'Construction & Timeline', 'slug' => 'construction-timeline', 'order' => 2],
            ['name' => 'Booking & Payment', 'slug' => 'booking-payment', 'order' => 3],
            ['name' => 'Legal & Fees', 'slug' => 'legal-fees', 'order' => 4],
            ['name' => 'Documentation', 'slug' => 'documentation', 'order' => 5],
        ];

        $catIds = [];
        foreach ($categories as $cat) {
            $id = DB::table('faq_categories')->insertGetId(array_merge($cat, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            $catIds[$cat['slug']] = $id;
        }

        $faqs = [
            // Project Overview
            [
                'faq_category_id' => $catIds['project-overview'],
                'question' => 'What is Panda Towers 001?',
                'answer' => "It is an apartments project by Panda Towers 001 Developers comprising of studio and 1 bedroom units priced at KES 2.9 Million and KES 3.95 Million respectively. Early bird discounts available for purchases made before 20th December:\nStudio at 2.35M\n1 bedroom at 3.5M\nFurther all-cash discount available as well.",
                'order' => 1,
            ],
            [
                'faq_category_id' => $catIds['project-overview'],
                'question' => 'Where is it located?',
                'answer' => 'Panda Towers 001 is located in Kinoo along Waiyaki Way.',
                'order' => 2,
            ],
            [
                'faq_category_id' => $catIds['project-overview'],
                'question' => 'How many units is it?',
                'answer' => 'Panda Towers 001 consists of 100 studio apartments and 40 1 bedroom apartments.',
                'order' => 3,
            ],
            [
                'faq_category_id' => $catIds['project-overview'],
                'question' => 'How many floors will the project have?',
                'answer' => 'The project is a ground plus ten storey building with a basement parking & the ground floor having some parking.',
                'order' => 4,
            ],
            // Construction & Timeline
            [
                'faq_category_id' => $catIds['construction-timeline'],
                'question' => 'How long is the construction period projected to take?',
                'answer' => 'The construction is projected to take 18-24 months.',
                'order' => 1,
            ],
            [
                'faq_category_id' => $catIds['construction-timeline'],
                'question' => 'How long is the repayment period for the Instalment option?',
                'answer' => 'A maximum of 24 months, groundbreaking in February 2026 and handover in August 2028.',
                'order' => 2,
            ],
            [
                'faq_category_id' => $catIds['construction-timeline'],
                'question' => 'Are the units ready for occupation?',
                'answer' => 'The initial sales are on an off-plan model.',
                'order' => 3,
            ],
            // Booking & Payment
            [
                'faq_category_id' => $catIds['booking-payment'],
                'question' => 'How much does one need to reserve a unit?',
                'answer' => 'KES 150,000 for a studio unit and KES 200,000 for a one bedroom. This amount will go into your 30% deposit upon project groundbreaking in Feb 2026.',
                'order' => 1,
            ],
            [
                'faq_category_id' => $catIds['booking-payment'],
                'question' => 'Can you manage the property for investors?',
                'answer' => 'Yes, we can arrange property management for investors.',
                'order' => 2,
            ],
            [
                'faq_category_id' => $catIds['booking-payment'],
                'question' => "Can I invest if I don't live in Kenya?",
                'answer' => 'Yes, we welcome investors from the diaspora.',
                'order' => 3,
            ],
            // Legal & Fees
            [
                'faq_category_id' => $catIds['legal-fees'],
                'question' => 'Do the prices include the legal and other county fees?',
                'answer' => 'The legal fees & other closing costs are not included in the prices. The legal fees are payable to the project lawyers for drafting the agreements, certifying the executed agreements and taking the agreements for stamp duty assessment. Additionally stamp duty is payable directly to KRA, equivalent to 4% of the unit value. All fees should be paid by the investor before project completion.',
                'order' => 1,
            ],
            [
                'faq_category_id' => $catIds['legal-fees'],
                'question' => 'Can an investor use their lawyers for conveyance?',
                'answer' => 'Yes, investors can use their private lawyers for the legal aspects of the project at their (additional) own costs.',
                'order' => 2,
            ],
            // Documentation
            [
                'faq_category_id' => $catIds['documentation'],
                'question' => 'Where can one get the drawings or layout plan?',
                'answer' => 'Email us on invest@pandatowers.africa.',
                'order' => 1,
            ],
        ];

        foreach ($faqs as $faq) {
            DB::table('faq_items')->insert(array_merge($faq, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
