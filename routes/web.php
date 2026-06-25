<?php

use App\Http\Controllers\Cms\BlogController;
use App\Http\Controllers\Cms\DashboardController;
use App\Http\Controllers\Cms\FaqController;
use App\Http\Controllers\Cms\InvestmentController;
use App\Http\Controllers\Cms\MediaController;
use App\Http\Controllers\Cms\NavigationController;
use App\Http\Controllers\Cms\PagesController;
use App\Http\Controllers\Cms\ProjectUpdatesController;
use App\Http\Controllers\Cms\SettingsController;
use App\Http\Controllers\Cms\TestimonialsController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->prefix('cms')->name('cms.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Pages
    Route::get('/pages', [PagesController::class, 'index'])->name('pages.index');
    Route::get('/pages/create', [PagesController::class, 'create'])->name('pages.create');
    Route::post('/pages', [PagesController::class, 'store'])->name('pages.store');
    Route::get('/pages/{page}/edit', [PagesController::class, 'edit'])->name('pages.edit');
    Route::put('/pages/{page}', [PagesController::class, 'update'])->name('pages.update');
    Route::delete('/pages/{page}', [PagesController::class, 'destroy'])->name('pages.destroy');

    // Page Sections (dynamic section builder)
    Route::get('/pages/{page}/sections', [PagesController::class, 'sections'])->name('pages.sections');
    Route::post('/pages/{page}/sections', [PagesController::class, 'storeSection'])->name('pages.sections.store');
    Route::put('/pages/{page}/sections/{section}', [PagesController::class, 'updateSection'])->name('pages.sections.update');
    Route::post('/pages/{page}/sections/reorder', [PagesController::class, 'reorderSections'])->name('pages.sections.reorder');
    Route::delete('/pages/{page}/sections/{section}', [PagesController::class, 'destroySection'])->name('pages.sections.destroy');

    // Blog
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/blog/create', [BlogController::class, 'create'])->name('blog.create');
    Route::post('/blog', [BlogController::class, 'store'])->name('blog.store');
    Route::get('/blog/{blogPost}/edit', [BlogController::class, 'edit'])->name('blog.edit');
    Route::put('/blog/{blogPost}', [BlogController::class, 'update'])->name('blog.update');
    Route::delete('/blog/{blogPost}', [BlogController::class, 'destroy'])->name('blog.destroy');
    Route::get('/blog-categories', [BlogController::class, 'categories'])->name('blog.categories');
    Route::post('/blog-categories', [BlogController::class, 'storeCategory'])->name('blog.categories.store');
    Route::put('/blog-categories/{blogCategory}', [BlogController::class, 'updateCategory'])->name('blog.categories.update');
    Route::delete('/blog-categories/{blogCategory}', [BlogController::class, 'destroyCategory'])->name('blog.categories.destroy');

    // FAQ
    Route::get('/faq', [FaqController::class, 'index'])->name('faq.index');
    Route::post('/faq/categories', [FaqController::class, 'storeCategory'])->name('faq.categories.store');
    Route::put('/faq/categories/{faqCategory}', [FaqController::class, 'updateCategory'])->name('faq.categories.update');
    Route::delete('/faq/categories/{faqCategory}', [FaqController::class, 'destroyCategory'])->name('faq.categories.destroy');
    Route::post('/faq/items', [FaqController::class, 'storeItem'])->name('faq.items.store');
    Route::put('/faq/items/{faqItem}', [FaqController::class, 'updateItem'])->name('faq.items.update');
    Route::delete('/faq/items/{faqItem}', [FaqController::class, 'destroyItem'])->name('faq.items.destroy');

    // Testimonials
    Route::get('/testimonials', [TestimonialsController::class, 'index'])->name('testimonials.index');
    Route::post('/testimonials', [TestimonialsController::class, 'store'])->name('testimonials.store');
    Route::put('/testimonials/{testimonial}', [TestimonialsController::class, 'update'])->name('testimonials.update');
    Route::delete('/testimonials/{testimonial}', [TestimonialsController::class, 'destroy'])->name('testimonials.destroy');

    // Investment (Units + Amenities)
    Route::get('/investment', [InvestmentController::class, 'index'])->name('investment.index');
    Route::post('/investment/units', [InvestmentController::class, 'storeUnit'])->name('investment.units.store');
    Route::put('/investment/units/{unitType}', [InvestmentController::class, 'updateUnit'])->name('investment.units.update');
    Route::delete('/investment/units/{unitType}', [InvestmentController::class, 'destroyUnit'])->name('investment.units.destroy');
    Route::post('/investment/amenities', [InvestmentController::class, 'storeAmenity'])->name('investment.amenities.store');
    Route::put('/investment/amenities/{amenity}', [InvestmentController::class, 'updateAmenity'])->name('investment.amenities.update');
    Route::delete('/investment/amenities/{amenity}', [InvestmentController::class, 'destroyAmenity'])->name('investment.amenities.destroy');

    // Navigation
    Route::get('/navigation', [NavigationController::class, 'index'])->name('navigation.index');
    Route::post('/navigation', [NavigationController::class, 'store'])->name('navigation.store');
    Route::put('/navigation/{navigationItem}', [NavigationController::class, 'update'])->name('navigation.update');
    Route::post('/navigation/reorder', [NavigationController::class, 'reorder'])->name('navigation.reorder');
    Route::delete('/navigation/{navigationItem}', [NavigationController::class, 'destroy'])->name('navigation.destroy');

    // Settings (Hero, Social, Stats, Core Values, Track Records, Site Settings)
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'updateSettings'])->name('settings.update');
    Route::post('/settings/hero', [SettingsController::class, 'storeHero'])->name('settings.hero.store');
    Route::put('/settings/hero/{heroSlide}', [SettingsController::class, 'updateHero'])->name('settings.hero.update');
    Route::delete('/settings/hero/{heroSlide}', [SettingsController::class, 'destroyHero'])->name('settings.hero.destroy');
    Route::post('/settings/social', [SettingsController::class, 'storeSocial'])->name('settings.social.store');
    Route::put('/settings/social/{socialLink}', [SettingsController::class, 'updateSocial'])->name('settings.social.update');
    Route::delete('/settings/social/{socialLink}', [SettingsController::class, 'destroySocial'])->name('settings.social.destroy');
    Route::post('/settings/stats', [SettingsController::class, 'storeStat'])->name('settings.stats.store');
    Route::put('/settings/stats/{stat}', [SettingsController::class, 'updateStat'])->name('settings.stats.update');
    Route::delete('/settings/stats/{stat}', [SettingsController::class, 'destroyStat'])->name('settings.stats.destroy');
    Route::post('/settings/core-values', [SettingsController::class, 'storeCoreValue'])->name('settings.core-values.store');
    Route::put('/settings/core-values/{coreValue}', [SettingsController::class, 'updateCoreValue'])->name('settings.core-values.update');
    Route::delete('/settings/core-values/{coreValue}', [SettingsController::class, 'destroyCoreValue'])->name('settings.core-values.destroy');
    Route::post('/settings/track-records', [SettingsController::class, 'storeTrackRecord'])->name('settings.track-records.store');
    Route::put('/settings/track-records/{trackRecord}', [SettingsController::class, 'updateTrackRecord'])->name('settings.track-records.update');
    Route::delete('/settings/track-records/{trackRecord}', [SettingsController::class, 'destroyTrackRecord'])->name('settings.track-records.destroy');

    // Project Updates
    Route::get('/project-updates', [ProjectUpdatesController::class, 'index'])->name('project-updates.index');
    Route::post('/project-updates', [ProjectUpdatesController::class, 'store'])->name('project-updates.store');
    Route::put('/project-updates/{projectUpdate}', [ProjectUpdatesController::class, 'update'])->name('project-updates.update');
    Route::delete('/project-updates/{projectUpdate}', [ProjectUpdatesController::class, 'destroy'])->name('project-updates.destroy');

    // Media
    Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::post('/media', [MediaController::class, 'store'])->name('media.store');
    Route::put('/media/{medium}', [MediaController::class, 'update'])->name('media.update');
    Route::delete('/media/{medium}', [MediaController::class, 'destroy'])->name('media.destroy');
});

require __DIR__ . '/settings.php';
