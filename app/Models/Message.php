<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'content',
        'is_unsent',
        'chatroom_id',
        'role',
        'vector_results',
    ];

    public function chatroom() {
        return $this->belongsTo(Chatroom::class);
    }
}
