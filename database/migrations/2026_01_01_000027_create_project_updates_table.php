<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_updates', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('month');
            $table->string('location')->default('Nairobi, Kenya');
            $table->string('image')->nullable();
            $table->string('status');
            $table->text('highlight');
            $table->text('description')->nullable();
            $table->jsonb('highlights')->default('[]');
            $table->boolean('is_current_phase')->default(false);
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_updates');
    }
};
