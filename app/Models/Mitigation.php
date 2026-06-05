<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mitigation extends Model
{
    protected $fillable = [
        'finding_id',
        'description',
    ];

    public function finding() {
        return $this->belongsTo(Finding::class, 'finding_id');
    }
}
