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
        Schema::create('evaluation_pattern_finding', function (Blueprint $table) {
           $table->id();
           $table->foreignId("evaluation_pattern_id")->constrained();
           $table->foreignId("finding_id")->constrained()->cascadeOnDelete();
           $table->text("description")->nullable();
           $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_pattern_finding');
    }
};
