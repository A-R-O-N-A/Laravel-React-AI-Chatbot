<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    protected $fillable = [
        'name',
        'path',
        'mime_type',
        'size',
        'disk',
        'user_id',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    public function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function chatrooms() : BelongsToMany {
        return $this->belongsToMany(Chatroom::class, 'chatroom_documents')->withTimestamps();
    }

    protected static function booted() {
        static::deleting(function (Document $document) {
            // If using SoftDeletes, only remove file on forceDelete
            if (method_exists($document, 'isForceDeleting') && !$document->isForceDeleting()) {
                return;
            }

            if ($document->path) {
                Storage::disk($document->disk ?? 'public')->delete($document->path);
            }
        });
    }

}
