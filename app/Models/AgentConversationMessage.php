<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentConversationMessage extends Model
{
    protected $table = 'agent_conversation_messages';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'conversation_id',
        'user_id',
        'agent',
        'role',
        'content',
        'attachments',
        'tool_calls',
        'tool_results',
        'usage',
        'meta',
    ];

    public function conversation()
    {
        return $this->belongsTo(
            AgentConversation::class,
            'conversation_id',
            'id',
        );
    }
}
