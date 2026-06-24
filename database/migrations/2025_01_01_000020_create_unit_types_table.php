<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_types', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Studio, 1 Bedroom, 2 Bedroom
            $table->string('size')->nullable(); // 23 sqm
            $table->unsignedInteger('bedrooms')->default(0);
            $table->unsignedInteger('bathrooms')->default(1);
            $table->string('price_label')->nullable(); // KES 2.9M
            $table->unsignedBigInteger('price_value')->default(0);
            $table->unsignedBigInteger('all_cash_price')->nullable();
            $table->unsignedBigInteger('booking_fee')->nullable();
            $table->string('monthly_rent_label')->nullable();
            $table->unsignedInteger('monthly_rent_value')->nullable();
            $table->string('yield_range')->nullable(); // 7.9 - 9%
            $table->unsignedInteger('total_units')->default(0);
            $table->unsignedInteger('available_units')->default(0);
            $table->string('featured_image')->nullable();
            $table->jsonb('gallery')->default('[]');
            $table->jsonb('features')->default('[]');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_types');
    }
};
