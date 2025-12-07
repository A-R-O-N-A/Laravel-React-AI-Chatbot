<?php

use App\Http\Controllers\ChatroomController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    // redirect user if logged in 
    if (Auth::check()) {
        return redirect()->route('dashboard'); // Use redirect instead of render
    }

    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {

        return Inertia::render('dashboard');
    })->name('dashboard');

    // stuff for the chatroom
    Route::post('/chatrooms', [ChatroomController::class, 'store'])->name('chatrooms.store');

    Route::get('/archive', [ChatroomController::class, 'archive_list'])->name('chatrooms.archive_list');
    Route::get('/chatrooms/{chatroom}', [ChatroomController::class, 'show'])->name('chatrooms.show');

    Route::patch('/chatrooms/{chatroom}/archive', [ChatroomController::class, 'archive'])->name('chatrooms.archive');
    Route::patch('/chatrooms/{chatroom}/unarchive', [ChatroomController::class, 'unarchive' ])->name('chatrooms.unarchive');
    Route::patch('/chatrooms/{chatroom}/update', [ChatroomController::class, 'update'])->name('chatrooms.update');

    Route::delete('/chatrooms/{chatroom}/delete', [ChatroomController::class, 'destroy'])->name('chatrooms.destroy');

    // this is for the messages
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::post('/messages/ai', [MessageController::class, 'send_ai_message'])->name('messages.send_ai');
    
    // fastapi experimental
    Route::post('/messages/ai/fastapi', [MessageController::class, 'sent_ai_message_fastapi'])->name('messages.send_ai_fastapi');

});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
