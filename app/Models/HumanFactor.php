<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HumanFactor extends Model
{
    protected $fillable = [
        'name',
        'category',
        'icon',
    ];
    public function evaluationPatterns() {
        return $this->hasMany(EvaluationPattern::class);
    }
}
