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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_case_id')->constrained()->cascadeOnDelete();
            $table->string('task_name');
            $table->string('user_type');  //utente novizio, medio, operatore critico
            $table->string('user_role');
            $table->text('user_intent');
            $table->integer('stress_level')->default(5);
            $table->string('cost_of_error')->default('medium');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
