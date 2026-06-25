<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectUpdatesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('project_updates')->truncate();

        $updates = [
            [
                'title'            => 'Panda Towers 001 – Phase 1: Ground Breaking',
                'month'            => 'November 2025',
                'location'         => 'Nairobi, Kenya',
                'image'            => '/1_1 - Photo.jpg',
                'status'           => 'Ground Breaking',
                'highlight'        => 'Ground breaking ceremony scheduled for 2nd February 2026. Booking period now open.',
                'description'      => 'Ground breaking ceremony marks the official start of construction. This milestone brings together investors, partners, local authorities, and community members to celebrate the beginning of this transformative project.',
                'highlights'       => json_encode([
                    'Official ground breaking ceremony scheduled for February 2nd, 2026',
                    'Site mobilization and preparation completed',
                    'Construction equipment and materials ready',
                    'Booking period now open for early investors',
                ]),
                'is_current_phase' => true,
                'order'            => 4,
                'is_active'        => true,
            ],
            [
                'title'            => 'Panda Towers 001 – Phase 1: Pre-Construction',
                'month'            => 'October 2025',
                'location'         => 'Nairobi, Kenya',
                'image'            => '/1_1 - Photo.jpg',
                'status'           => 'Pre-Construction',
                'highlight'        => 'Final permits secured. Site mobilization in progress.',
                'description'      => 'The pre-construction phase involved securing final permits, mobilizing equipment and materials, and preparing the site for construction. We established our construction camp and began assembling our expert team.',
                'highlights'       => json_encode([
                    'Secured final construction permits',
                    'Established on-site construction camp',
                    'Procured construction materials and equipment',
                    'Assembled project management team',
                ]),
                'is_current_phase' => false,
                'order'            => 3,
                'is_active'        => true,
            ],
            [
                'title'            => 'Panda Towers 001 – Phase 1: Design Finalization',
                'month'            => 'September 2025',
                'location'         => 'Nairobi, Kenya',
                'image'            => '/1_1 - Photo.jpg',
                'status'           => 'Planning',
                'highlight'        => 'Design finalized. Stakeholder approvals completed.',
                'description'      => 'Design finalization phase involved detailed engineering drawings, material specifications, and stakeholder approvals. Our team worked closely with architects, engineers, and local authorities to perfect every aspect of the design.',
                'highlights'       => json_encode([
                    'Completed detailed engineering drawings',
                    'Finalized material and finish specifications',
                    'Obtained all necessary regulatory approvals',
                    'Prepared construction documentation',
                ]),
                'is_current_phase' => false,
                'order'            => 2,
                'is_active'        => true,
            ],
            [
                'title'            => 'Panda Towers 001 – Phase 1: Conceptual Design',
                'month'            => 'August 2025',
                'location'         => 'Nairobi, Kenya',
                'image'            => '/1_1 - Photo.jpg',
                'status'           => 'Planning',
                'highlight'        => 'Conceptual design & community consultations completed.',
                'description'      => 'Our journey began with comprehensive conceptual design and community consultations. We conducted extensive stakeholder engagement sessions, environmental impact assessments, and architectural planning to ensure Panda Towers 001 would meet the highest standards.',
                'highlights'       => json_encode([
                    'Completed community consultations with local stakeholders',
                    'Finalized conceptual architectural designs',
                    'Conducted environmental impact assessments',
                    'Established project timeline and milestones',
                ]),
                'is_current_phase' => false,
                'order'            => 1,
                'is_active'        => true,
            ],
        ];

        foreach ($updates as $update) {
            DB::table('project_updates')->insert(array_merge($update, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
