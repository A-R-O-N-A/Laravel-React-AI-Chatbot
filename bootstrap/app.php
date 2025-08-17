<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\NoCacheHeaders;
use App\Http\Middleware\RedirectIfAuthenticated;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // CAUTIOH
        // Register the middleware alias
        $middleware->alias([
            'nocache' => NoCacheHeaders::class,
            // 'guest.redirect' => RedirectIfAuthenticated::class,
            'guest.redirect' => \App\Http\Middleware\RedirectIfAuthenticated::class,

        ]);
        // CAUTION
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
