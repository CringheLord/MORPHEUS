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

            //audit control
            $table->string('audit_status')->default('pending');
            $table->unsignedBigInteger('audit_current')->default(0);
            $table->unsignedInteger('audit_total')->default(0);
            $table->string('audit_message')->nullable();
            $table->text('audit_error')->nullable();
            $table->timestamp('audit_started_at')->nullable();
            $table->timestamp('audit_completed_at')->nullable();

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
