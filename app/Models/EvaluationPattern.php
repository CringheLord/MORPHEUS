<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationPattern extends Model
{
    protected $fillable = [
        'h_id',
        'title',
        'icon',
        'human_factor_id',
        'trigger',
        'examples',
        'human_factor_exp',
        'error',
        'mitigation',
        'criticality_context',
        'organizational_link',
        'evidence',
        'audit_rule',
        'violations',
        'security_risk',
        'remediation',
        'org_question',
        'reference',
    ];

    public function humanFactor() {
        return $this->belongsTo(HumanFactor::class);
    }
    public function uiTags() {
        return $this->belongsToMany(UiTag::class, 'evaluation_pattern_ui_tag')
            ->withTimestamps();
    }

    public function findings()
    {
        return $this->belongsToMany(Finding::class, 'evaluation_pattern_finding')->withPivot('description');
    }
}
