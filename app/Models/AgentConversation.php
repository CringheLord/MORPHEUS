<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentConversation extends Model
{
    protected $table = 'agent_conversations';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'task_id',
        'title',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(
            AgentConversationMessage::class,
            'conversation_id',
            'id',
        );
    }
}
