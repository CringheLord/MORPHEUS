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
            $table->string('title')->nullable();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('artifact_id')->constrained()->cascadeOnDelete();
            $table->longText('internal_reasoning')->nullable();
            $table->longText('pragmatic_explanation')->nullable();
            $table->longText('description')->nullable();
            $table->text('impact')->nullable();
            $table->string('severity')->nullable();
            $table->longText('executive_question')->nullable();

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
