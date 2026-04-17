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
        Schema::create('heuristics', function (Blueprint $table) {
            $table->id();
            $table->string("h_id")->unique();
            $table->string("title");
            $table->foreignId("human_factor_id")->constrained();
            $table->longText("trigger");
            $table->longText("examples");
            $table->longText("human_factor_exp");
            $table->longText("error");
            $table->longText("mitigation");
            $table->longText("audit_rule");
            $table->longText("violations");
            $table->longText("security_risk");
            $table->longText("remediation");
            $table->longText("org_question");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('heuristics');
    }
};
