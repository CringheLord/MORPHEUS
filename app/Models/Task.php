<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'study_case_id',
        'flow_name',
        'user_type',
        'user_role',
        'user_intent',
        'stress_level',
        'cost_of_error'
    ];

    public function studyCase() {
        return $this->belongsTo(StudyCase::class, 'study_case_id');
    }
}
