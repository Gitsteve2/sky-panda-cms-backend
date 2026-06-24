<?php

use App\Http\Controllers\Api\PublicApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.')->group(function () {
    Route::get('/settings', [PublicApiController::class, 'settings'])->name('settings');
    Route::get('/navigation', [PublicApiController::class, 'navigation'])->name('navigation');
    Route::get('/hero', [PublicApiController::class, 'hero'])->name('hero');
    Route::get('/testimonials', [PublicApiController::class, 'testimonials'])->name('testimonials');
    Route::get('/blog', [PublicApiController::class, 'blog'])->name('blog');
    Route::get('/blog/{id}', [PublicApiController::class, 'blogPost'])->name('blog.post');
    Route::get('/blog-categories', [PublicApiController::class, 'blogCategories'])->name('blog.categories');
    Route::get('/faq', [PublicApiController::class, 'faq'])->name('faq');
    Route::get('/investment', [PublicApiController::class, 'investment'])->name('investment');
    Route::get('/about', [PublicApiController::class, 'about'])->name('about');
    Route::get('/social', [PublicApiController::class, 'social'])->name('social');
});
