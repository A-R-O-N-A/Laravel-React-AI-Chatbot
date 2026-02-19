<?php

use App\Http\Controllers\ChatroomController;
use App\Http\Controllers\ChatroomDocumentController;
use App\Http\Controllers\DocumentController;
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

    // test the file upload route
    Route::post('/file/upload/', [MessageController::class, 'rag_file_upload'])->name('rag.file_upload');

    // new resource controllers
    Route::resource('documents', DocumentController::class);
    Route::resource('chatroom-documents', ChatroomDocumentController::class);

    // utility
    Route::get('/doucments/{docId}/preview', [DocumentController::class, 'getPDFPreview'])->name('documents.preview');

    // ping
    Route::get('/ping/test', [ChatroomController::class, 'ping'])->name('ping.text');
    Route::post('/ping/test/message', [ChatroomController::class, 'ping_fastapi'])->name('ping.fastapi');

    // testbed
    Route::get('/testbed/file-vectorize',[DocumentController::class, 'fastapi_vectorize_test'])->name('testbed.file_vectorize');
    Route::post('/testbed/vectorize', [DocumentController::class, 'vectorize_test'])->name('testbed.vectorize');

    // OCR processing basic
    Route::post('/ocr/process-image', [MessageController::class, 'image_ocr'])->name('ocr.process_image');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
