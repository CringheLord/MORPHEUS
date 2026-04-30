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
        Schema::create('evaluation_patterns', function (Blueprint $table) {
            $table->id();
            $table->string("h_id")->unique();
            $table->string("title")->nullable();
            $table->string("icon")->default("Hexagon");
            $table->integer('incidence_rate')->default('0');
            $table->foreignId("human_factor_id")->constrained();
            $table->longText("trigger")->nullable();
            $table->longText("examples")->nullable();
            $table->longText("human_factor_exp")->nullable();
            $table->longText("error")->nullable();
            $table->longText("mitigation")->nullable();
            $table->longText("criticality_context")->nullable();
            $table->longText("evidence")->nullable();
            $table->longText("audit_rule")->nullable();
            $table->longText("violations")->nullable();
            $table->longText("security_risk")->nullable();
            $table->longText("remediation")->nullable();
            $table->longText("org_question")->nullable();
            $table->text("reference")->nullable();
            $table->integer("number_of_violations")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_patterns');
    }
};
