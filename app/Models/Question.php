<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

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

