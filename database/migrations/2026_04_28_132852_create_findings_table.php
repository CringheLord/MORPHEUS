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
        Schema::create('findings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_case_id')->constrained()->cascadeOnDelete();
            $table->foreignId('artifact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('evaluation_pattern_id')->constrained();
            $table->text('visual_element_description');
            $table->text('internal_reasoning');
            $table->text('pragmatic_explanation');
            $table->string('severity')->nullable();
            $table->text('executive_question');
            $table->string('status')->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('findings');
    }
};
