<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = [
        'questionnaire_id',
        'question_id',
        'answer',
        'score',
        'submission_id',
        'text',
    ];
    public function question() {
        return $this->belongsTo(Question::class);
    }
    public function submission() {
        return $this->belongsTo(Submission::class);
    }
}
