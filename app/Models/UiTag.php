<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UiTag extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    public function heuristics() {
        return $this->belongsToMany(Heuristic::class, 'heuristic_ui_tag');
    }

}
