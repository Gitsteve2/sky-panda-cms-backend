<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('blog_posts', 'author_name')) {
            Schema::table('blog_posts', function (Blueprint $table) {
                $table->string('author_name')->nullable()->after('author_id');
            });
        }

        // Backfill existing posts with a default author if missing
        $admin = DB::table('users')->first();
        DB::table('blog_posts')
            ->whereNull('author_name')
            ->update([
                'author_id' => $admin?->id,
                'author_name' => $admin?->name ?? 'Panda Towers Team',
            ]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('blog_posts', 'author_name')) {
            Schema::table('blog_posts', function (Blueprint $table) {
                $table->dropColumn('author_name');
            });
        }
    }
};

