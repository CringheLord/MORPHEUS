<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudyCase extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'system_name',
        'system_type',
        'target_url',
        'analysis_goal',
        'status',
        'risk_score',
        'c_percentage',
        'current_layer',
        'current_step',
        'started_at',
        'completed_at',
        'last_opened_at',
        'last_opened_section',
        'meta',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'last_opened_at' => 'datetime',
        'meta' => 'array',
        'risk_score' => 'decimal:2',
    ];

    public function owner () {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function users() {
        return $this->belongsToMany(User::class)
        ->withTimestamps();
    }
}
