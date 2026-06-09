<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Finding extends Model
{
    //
    protected $fillable = [
        'title',
        'task_id',
        'artifact_id',
        'evaluation_pattern_id',
        'executive_question',
        'severity',
        'pragmatic_explanation',
        'internal_reasoning',
        'visual_element_description',
        'study_case_id',
        'description',
        'impact',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function mitigations()
    {
        return $this->hasMany(Mitigation::class);
    }

    public function evaluationPatterns()
    {
        return $this->belongsToMany(EvaluationPattern::class, 'evaluation_pattern_finding')->withPivot('description');
    }
}
