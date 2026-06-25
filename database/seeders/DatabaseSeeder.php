<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@pandatowers.africa'],
            [
                'name' => 'Panda Towers Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            SiteSettingsSeeder::class,
            NavigationSeeder::class,
            HeroSeeder::class,
            TestimonialsSeeder::class,
            BlogSeeder::class,
            FaqSeeder::class,
            InvestmentSeeder::class,
            AboutSeeder::class,
            StatsAndSocialSeeder::class,
            PagesSeeder::class,
        ]);
    }
}
