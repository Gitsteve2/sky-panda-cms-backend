<?php

use App\Http\Controllers\Cms\BlogController;
use App\Http\Controllers\Cms\DashboardController;
use App\Http\Controllers\Cms\FaqController;
use App\Http\Controllers\Cms\InvestmentController;
use App\Http\Controllers\Cms\MediaController;
use App\Http\Controllers\Cms\NavigationController;
use App\Http\Controllers\Cms\PagesController;
use App\Http\Controllers\Cms\ProjectUpdatesController;
use App\Http\Controllers\Cms\RoleController;
use App\Http\Controllers\Cms\SettingsController;
use App\Http\Controllers\Cms\TestimonialsController;
use App\Http\Controllers\Cms\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'active'])->prefix('cms')->name('cms.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Pages
    Route::get('/pages', [PagesController::class, 'index'])->middleware('permission:pages.view')->name('pages.index');
    Route::get('/pages/create', [PagesController::class, 'create'])->middleware('permission:pages.create')->name('pages.create');
    Route::post('/pages', [PagesController::class, 'store'])->middleware('permission:pages.create')->name('pages.store');
    Route::get('/pages/{page}/edit', [PagesController::class, 'edit'])->middleware('permission:pages.edit')->name('pages.edit');
    Route::put('/pages/{page}', [PagesController::class, 'update'])->middleware('permission:pages.edit')->name('pages.update');
    Route::delete('/pages/{page}', [PagesController::class, 'destroy'])->middleware('permission:pages.delete')->name('pages.destroy');

    // Page Sections
    Route::get('/pages/{page}/sections', [PagesController::class, 'sections'])->middleware('permission:pages.edit')->name('pages.sections');
    Route::post('/pages/{page}/sections', [PagesController::class, 'storeSection'])->middleware('permission:pages.edit')->name('pages.sections.store');
    Route::put('/pages/{page}/sections/{section}', [PagesController::class, 'updateSection'])->middleware('permission:pages.edit')->name('pages.sections.update');
    Route::post('/pages/{page}/sections/reorder', [PagesController::class, 'reorderSections'])->middleware('permission:pages.edit')->name('pages.sections.reorder');
    Route::delete('/pages/{page}/sections/{section}', [PagesController::class, 'destroySection'])->middleware('permission:pages.delete')->name('pages.sections.destroy');

    // Blog
    Route::get('/blog', [BlogController::class, 'index'])->middleware('permission:blog.view')->name('blog.index');
    Route::get('/blog/create', [BlogController::class, 'create'])->middleware('permission:blog.create')->name('blog.create');
    Route::post('/blog', [BlogController::class, 'store'])->middleware('permission:blog.create')->name('blog.store');
    Route::get('/blog/{blogPost}/edit', [BlogController::class, 'edit'])->middleware('permission:blog.edit')->name('blog.edit');
    Route::put('/blog/{blogPost}', [BlogController::class, 'update'])->middleware('permission:blog.edit')->name('blog.update');
    Route::delete('/blog/{blogPost}', [BlogController::class, 'destroy'])->middleware('permission:blog.delete')->name('blog.destroy');
    Route::get('/blog-categories', [BlogController::class, 'categories'])->middleware('permission:blog.view')->name('blog.categories');
    Route::post('/blog-categories', [BlogController::class, 'storeCategory'])->middleware('permission:blog.create')->name('blog.categories.store');
    Route::put('/blog-categories/{blogCategory}', [BlogController::class, 'updateCategory'])->middleware('permission:blog.edit')->name('blog.categories.update');
    Route::delete('/blog-categories/{blogCategory}', [BlogController::class, 'destroyCategory'])->middleware('permission:blog.delete')->name('blog.categories.destroy');

    // FAQ
    Route::get('/faq', [FaqController::class, 'index'])->middleware('permission:faq.view')->name('faq.index');
    Route::post('/faq/categories', [FaqController::class, 'storeCategory'])->middleware('permission:faq.create')->name('faq.categories.store');
    Route::put('/faq/categories/{faqCategory}', [FaqController::class, 'updateCategory'])->middleware('permission:faq.edit')->name('faq.categories.update');
    Route::delete('/faq/categories/{faqCategory}', [FaqController::class, 'destroyCategory'])->middleware('permission:faq.delete')->name('faq.categories.destroy');
    Route::post('/faq/items', [FaqController::class, 'storeItem'])->middleware('permission:faq.create')->name('faq.items.store');
    Route::put('/faq/items/{faqItem}', [FaqController::class, 'updateItem'])->middleware('permission:faq.edit')->name('faq.items.update');
    Route::delete('/faq/items/{faqItem}', [FaqController::class, 'destroyItem'])->middleware('permission:faq.delete')->name('faq.items.destroy');

    // Testimonials
    Route::get('/testimonials', [TestimonialsController::class, 'index'])->middleware('permission:testimonials.view')->name('testimonials.index');
    Route::post('/testimonials', [TestimonialsController::class, 'store'])->middleware('permission:testimonials.create')->name('testimonials.store');
    Route::put('/testimonials/{testimonial}', [TestimonialsController::class, 'update'])->middleware('permission:testimonials.edit')->name('testimonials.update');
    Route::delete('/testimonials/{testimonial}', [TestimonialsController::class, 'destroy'])->middleware('permission:testimonials.delete')->name('testimonials.destroy');

    // Investment
    Route::get('/investment', [InvestmentController::class, 'index'])->middleware('permission:investment.view')->name('investment.index');
    Route::post('/investment/units', [InvestmentController::class, 'storeUnit'])->middleware('permission:investment.create')->name('investment.units.store');
    Route::put('/investment/units/{unitType}', [InvestmentController::class, 'updateUnit'])->middleware('permission:investment.edit')->name('investment.units.update');
    Route::delete('/investment/units/{unitType}', [InvestmentController::class, 'destroyUnit'])->middleware('permission:investment.delete')->name('investment.units.destroy');
    Route::post('/investment/amenities', [InvestmentController::class, 'storeAmenity'])->middleware('permission:investment.create')->name('investment.amenities.store');
    Route::put('/investment/amenities/{amenity}', [InvestmentController::class, 'updateAmenity'])->middleware('permission:investment.edit')->name('investment.amenities.update');
    Route::delete('/investment/amenities/{amenity}', [InvestmentController::class, 'destroyAmenity'])->middleware('permission:investment.delete')->name('investment.amenities.destroy');

    // Navigation
    Route::get('/navigation', [NavigationController::class, 'index'])->middleware('permission:navigation.view')->name('navigation.index');
    Route::post('/navigation', [NavigationController::class, 'store'])->middleware('permission:navigation.create')->name('navigation.store');
    Route::put('/navigation/{navigationItem}', [NavigationController::class, 'update'])->middleware('permission:navigation.edit')->name('navigation.update');
    Route::post('/navigation/reorder', [NavigationController::class, 'reorder'])->middleware('permission:navigation.edit')->name('navigation.reorder');
    Route::delete('/navigation/{navigationItem}', [NavigationController::class, 'destroy'])->middleware('permission:navigation.delete')->name('navigation.destroy');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->middleware('permission:settings.view')->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'updateSettings'])->middleware('permission:settings.edit')->name('settings.update');
    Route::post('/settings/hero', [SettingsController::class, 'storeHero'])->middleware('permission:settings.edit')->name('settings.hero.store');
    Route::put('/settings/hero/{heroSlide}', [SettingsController::class, 'updateHero'])->middleware('permission:settings.edit')->name('settings.hero.update');
    Route::delete('/settings/hero/{heroSlide}', [SettingsController::class, 'destroyHero'])->middleware('permission:settings.edit')->name('settings.hero.destroy');
    Route::post('/settings/social', [SettingsController::class, 'storeSocial'])->middleware('permission:settings.edit')->name('settings.social.store');
    Route::put('/settings/social/{socialLink}', [SettingsController::class, 'updateSocial'])->middleware('permission:settings.edit')->name('settings.social.update');
    Route::delete('/settings/social/{socialLink}', [SettingsController::class, 'destroySocial'])->middleware('permission:settings.edit')->name('settings.social.destroy');
    Route::post('/settings/stats', [SettingsController::class, 'storeStat'])->middleware('permission:settings.edit')->name('settings.stats.store');
    Route::put('/settings/stats/{stat}', [SettingsController::class, 'updateStat'])->middleware('permission:settings.edit')->name('settings.stats.update');
    Route::delete('/settings/stats/{stat}', [SettingsController::class, 'destroyStat'])->middleware('permission:settings.edit')->name('settings.stats.destroy');
    Route::post('/settings/core-values', [SettingsController::class, 'storeCoreValue'])->middleware('permission:settings.edit')->name('settings.core-values.store');
    Route::put('/settings/core-values/{coreValue}', [SettingsController::class, 'updateCoreValue'])->middleware('permission:settings.edit')->name('settings.core-values.update');
    Route::delete('/settings/core-values/{coreValue}', [SettingsController::class, 'destroyCoreValue'])->middleware('permission:settings.edit')->name('settings.core-values.destroy');
    Route::post('/settings/track-records', [SettingsController::class, 'storeTrackRecord'])->middleware('permission:settings.edit')->name('settings.track-records.store');
    Route::put('/settings/track-records/{trackRecord}', [SettingsController::class, 'updateTrackRecord'])->middleware('permission:settings.edit')->name('settings.track-records.update');
    Route::delete('/settings/track-records/{trackRecord}', [SettingsController::class, 'destroyTrackRecord'])->middleware('permission:settings.edit')->name('settings.track-records.destroy');

    // Project Updates
    Route::get('/project-updates', [ProjectUpdatesController::class, 'index'])->middleware('permission:project-updates.view')->name('project-updates.index');
    Route::post('/project-updates', [ProjectUpdatesController::class, 'store'])->middleware('permission:project-updates.create')->name('project-updates.store');
    Route::put('/project-updates/{projectUpdate}', [ProjectUpdatesController::class, 'update'])->middleware('permission:project-updates.edit')->name('project-updates.update');
    Route::delete('/project-updates/{projectUpdate}', [ProjectUpdatesController::class, 'destroy'])->middleware('permission:project-updates.delete')->name('project-updates.destroy');

    // Media
    Route::get('/media', [MediaController::class, 'index'])->middleware('permission:media.view')->name('media.index');
    Route::post('/media', [MediaController::class, 'store'])->middleware('permission:media.upload')->name('media.store');
    Route::put('/media/{medium}', [MediaController::class, 'update'])->middleware('permission:media.upload')->name('media.update');
    Route::delete('/media/{medium}', [MediaController::class, 'destroy'])->middleware('permission:media.delete')->name('media.destroy');

    // User Management (super_admin only)
    Route::middleware('super_admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');

        // Role Management
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    });
});

require __DIR__ . '/settings.php';
