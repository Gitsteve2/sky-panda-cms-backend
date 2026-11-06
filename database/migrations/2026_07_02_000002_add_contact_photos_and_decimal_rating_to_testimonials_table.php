<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            if (! Schema::hasColumn('testimonials', 'email')) {
                $table->string('email')->nullable()->after('name');
            }
            if (! Schema::hasColumn('testimonials', 'phone')) {
                $table->string('phone', 50)->nullable()->after('email');
            }
            if (! Schema::hasColumn('testimonials', 'photos')) {
                $table->json('photos')->nullable()->after('testimonial');
            }
            $table->decimal('rating', 3, 1)->default(5.0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $columns = array_filter(
                ['email', 'phone', 'photos'],
                fn (string $col) => Schema::hasColumn('testimonials', $col),
            );

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};

