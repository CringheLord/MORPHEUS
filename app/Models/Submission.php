<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'questionnaire_id',
        'time_spent',
    ];

    public function questionnaire() {
        return $this->belongsTo(Questionnaire::class, 'questionnaire_id');
    }

    public function answers() {
        return $this->hasMany(Answer::class, 'submission_id');
    }
}
