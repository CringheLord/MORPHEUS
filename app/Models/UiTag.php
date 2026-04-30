<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UiTag extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    public function evaluationPattern() {
        return $this->belongsToMany(EvaluationPattern::class, 'evaluation_pattern_ui_tag');
    }

}
