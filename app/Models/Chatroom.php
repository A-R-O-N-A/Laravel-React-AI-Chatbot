<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function documents(): BelongsToMany {
        return $this->belongsToMany(Document::class, 'chatroom_documents')->withTimestamps();
    }

    protected static function booted() {
        static::deleting(function (Chatroom $chatroom) {
            // delete document models so their deleting hook runs (remove files first)
            // $chatroom->documents()->get()->each->delete();

            // $chatroom->documents()->get()->each->delete();
            // $chatroom->documents()->detach();

            // delete only pivot realtion
            $chatroom->documents()->detach();
        });
    }
}
