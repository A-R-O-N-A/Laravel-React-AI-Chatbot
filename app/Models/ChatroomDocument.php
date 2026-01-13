<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatroomDocument extends Model
{
    protected $table = 'chatroom_documents';

    protected $fillable = [
        'chatroom_id',
        'document_id',
    ];

    public function chatroom(): BelongsTo {
        return $this->belongsTo(Chatroom::class);
    }

    public function document(): BelongsTo {
        return $this->belongsTo(Document::class);
    }
}
