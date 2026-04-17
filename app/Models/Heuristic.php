<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Heuristic extends Model
{
    protected $fillable = [
        'h_id',
        'title',
        'human_factor_id',
        'trigger',
        'examples',
        'human_factor_exp',
        'error',
        'mitigation',
        'audit_rule',
        'violations',
        'security_risk',
        'remediation',
        'org_question',
    ];

    public function humanFactor() {
        return $this->belongsTo(HumanFactor::class);
    }
    public function uiTags() {
        return $this->belongsToMany(UiTag::class, 'heuristic_ui_tag')
            ->withTimestamps();
    }
}
