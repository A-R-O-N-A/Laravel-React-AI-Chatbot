<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
// Route::middleware(['guest', 'nocache'])->group(function () {
// Route::middleware(['guest', 'guest.redirect'])->group(function () {

    // below is the defaully registyer route
    // Route::get('register', [RegisteredUserController::class, 'create'])
    //     ->name('register');

    // below is the editted registed route to redirect us back to the dashboard if we area logged in
    Route::get('register', function() {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return app(RegisteredUserController::class)->create();
    })->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    // below is the defauly loging route

    // Route::get('login', [AuthenticatedSessionController::class, 'create'])
    //     ->name('login');

    // below is the edited login route to redirect us back to the dashboard if we have logged in
    Route::get('login', function() {
        if(Auth::check()) {
            return redirect()->route('dashboard');
        }

        return app(AuthenticatedSessionController::class)->create(request());
    })->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
