<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Finding extends Model
{
    //
    protected $fillable = [
        'study_case_id',
        'artifact_id',
        'evaluation_pattern_id',
        'executive_question',
        'severity',
        'pragmatic_explanation',
        'internal_reasoning',
        'visual_element_description',
    ];
}
