<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Questionnaire extends Model
{
    use HasFactory;

   protected $fillable = [
       'title',
       'description',
       'study_case_id',
       'created_by_id',
       'questions_number',
       'n_answered',
       'status',
   ];

    public function studyCase()
    {
        return $this->belongsTo(StudyCase::class);

    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'questionnaire_question')->withPivot('position');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by_id');
    }
}
