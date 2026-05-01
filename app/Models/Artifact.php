<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artifact extends Model
{

    protected $fillable = [
        'task_id',
        'image_url',
        'file_path',
        'study_case_id',
    ];

    public function studyCase() {
        return $this->belongsTo(StudyCase::class, 'study_case_id');
    }
    public function task() {
        return $this->belongsTo(Task::class);
    }
}
