<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'questionnaire_id',
        'title',
        'question',
        'type',
    ];

    public function questionnaire()
    {
        return $this->belongsToMany(Questionnaire::class, 'questionnaire_question')->withPivot('position');
    }
}

