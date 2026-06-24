<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // human-readable section name
            $table->string('section_type'); // hero, text, cards, testimonials, stats, cta, custom...
            $table->jsonb('content')->default('{}'); // flexible JSON content per section type
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('background_color')->nullable();
            $table->string('background_image')->nullable();
            $table->string('css_class')->nullable(); // custom CSS classes
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
