<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questionnaires', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->foreignId('study_case_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('draft');
            $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
            $table->string('link')->nullable();
            //$table->integer('questions_number')->default(0);
            //$table->integer('n_answered')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionnaires');
    }
};
