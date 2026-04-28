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
        Schema::create('study_cases', function (Blueprint $table) {
            $table->id();

            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('last_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('title');
            //$table->string('slug')->nullable()->unique()->change();
            $table->text('description')->nullable();

            $table->string('system_name');               // e.g. "HR Portal"
            $table->string('system_type')->nullable();  // web app, dashboard, e-commerce...
            $table->string('main_device')->nullable();
            $table->string('sector')->nullable();
            $table->string('target_url')->nullable();
            $table->text('analysis_goal')->nullable();

            $table->string('status')->default('draft'); // draft, in_progress, completed
            $table->string('risk_level')->default('low');
            $table->decimal('risk_score')->default(0);
            $table->integer('c_percentage')->default(0);

            $table->string('current_layer')->nullable(); // interface, cognitive, organizational, review
            $table->string('current_step')->nullable();  // optional finer workflow step

            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamp('last_opened_at')->nullable();
            $table->string('last_opened_section')->nullable(); // route/section/layer shortcut

            $table->string('brand_constraints')->default('default');  //L'AI non criticherà colori scuri se specifichi che il brand richiede un tono formale e autoritario.


            $table->json('meta')->nullable(); // flexible extra data while model is evolving


            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_cases');
    }
};
