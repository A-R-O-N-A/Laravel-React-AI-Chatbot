<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chatroom extends Model
{
    protected $fillable = [
        'name',
        'user_id',
        'is_archived'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }
}
