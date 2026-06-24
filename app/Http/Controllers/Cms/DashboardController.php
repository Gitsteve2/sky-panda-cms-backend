<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\FaqItem;
use App\Models\Page;
use App\Models\Testimonial;
use App\Models\UnitType;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/dashboard', [
            'stats' => [
                'pages' => Page::count(),
                'blog_posts' => BlogPost::count(),
                'published_posts' => BlogPost::where('is_published', true)->count(),
                'testimonials' => Testimonial::count(),
                'faqs' => FaqItem::count(),
                'unit_types' => UnitType::count(),
            ],
            'recent_posts' => BlogPost::with('category')
                ->latest()
                ->take(5)
                ->get(['id', 'title', 'slug', 'is_published', 'created_at', 'blog_category_id']),
        ]);
    }
}
