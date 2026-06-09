<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'study_case_id',
        'task_name',
        'user_type',
        'user_role',
        'user_intent',
        'stress_level',
        'cost_of_error',
        'status'
    ];

    public function studyCase() {
        return $this->belongsTo(StudyCase::class, 'study_case_id');
    }
    public function artifacts() {
        return $this->hasMany(Artifact::class);
    }

    public function findings() {
        return $this->hasMany(Finding::class);
    }

    public function conversation()
    {
        return $this->hasOne(AgentConversation::class);
    }
}
