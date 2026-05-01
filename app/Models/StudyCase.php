<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudyCase extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'last_user_id',
        'assigned_user_id',
        'title',
        //'slug',
        'description',
        'system_name',
        'system_type',
        'main_device',
        'target_url',
        'analysis_goal',
        'status',
        'sector',
        'risk_score',
        'risk_level',
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

    public function lastUser()
    {
        return $this->belongsTo(User::class, 'last_user_id');
    }
    public function assignedUser() {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function owner () {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function users() {
        return $this->belongsToMany(User::class)
            ->withPivot('current_layer')
            ->withTimestamps();
    }

    public function tasks () {
        return $this->hasMany(Task::class);
    }
    public function artifacts () {
        return $this->hasManyThrough(Artifact::class, Task::class);
    }
}
