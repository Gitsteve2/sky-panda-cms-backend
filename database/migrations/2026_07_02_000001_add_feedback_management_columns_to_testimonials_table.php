<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            if (! Schema::hasColumn('testimonials', 'company')) {
                $table->string('company')->nullable()->after('name');
            }
            if (! Schema::hasColumn('testimonials', 'status')) {
                $table->string('status', 30)->default('approved')->after('order');
            }
            if (! Schema::hasColumn('testimonials', 'source')) {
                $table->string('source', 30)->default('cms')->after('is_active');
            }
            if (! Schema::hasColumn('testimonials', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->after('source');
            }
            if (! Schema::hasColumn('testimonials', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('ip_address');
            }
        });

        DB::table('testimonials')
            ->where('status', 'approved')
            ->whereNull('approved_at')
            ->update(['approved_at' => now()]);
    }

    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $columns = array_filter(
                ['company', 'status', 'source', 'ip_address', 'approved_at'],
                fn (string $col) => Schema::hasColumn('testimonials', $col),
            );

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};

