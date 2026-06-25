<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\CoreValue;
use App\Models\FaqCategory;
use App\Models\HeroSlide;
use App\Models\NavigationItem;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\Stat;
use App\Models\Testimonial;
use App\Models\TrackRecord;
use App\Models\UnitType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    public function settings(): JsonResponse
    {
        $settings = SiteSetting::whereIn('key', [
            'site_name', 'tagline', 'logo_url', 'logo_white_url',
            'phone', 'email', 'whatsapp', 'address',
            'brochure_url', 'booking_form_url',
            'primary_color', 'accent_color',
            'meta_description', 'og_image',
            // Calculator
            'calculator_heading', 'calculator_subheading',
            'calculator_default_price', 'calculator_default_dp', 'calculator_default_yield',
            'calculator_dp_options', 'calculator_cta_text', 'calculator_cta_url',
            'calculator_whatsapp', 'calculator_disclaimer',
            // Location / Map
            'location_heading', 'location_address', 'location_description',
            'location_embed_url', 'location_map_image', 'location_highlights',
        ])->get()->pluck('value', 'key');

        return response()->json($settings);
    }

    public function navigation(): JsonResponse
    {
        $items = NavigationItem::where('is_active', true)
            ->orderBy('order')
            ->get(['id', 'label', 'path', 'type', 'target', 'order']);

        return response()->json($items);
    }

    public function hero(): JsonResponse
    {
        $slides = HeroSlide::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($slides);
    }

    public function testimonials(): JsonResponse
    {
        $testimonials = Testimonial::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($testimonials);
    }

    public function blog(Request $request): JsonResponse
    {
        $posts = BlogPost::with('category')
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->paginate(12);

        return response()->json($posts);
    }

    public function blogPost(int $id): JsonResponse
    {
        $post = BlogPost::with('category', 'author')
            ->where('is_published', true)
            ->findOrFail($id);

        $related = BlogPost::where('is_published', true)
            ->where('id', '!=', $id)
            ->inRandomOrder()
            ->limit(2)
            ->get(['id', 'title', 'excerpt', 'featured_image', 'category_id', 'published_at', 'read_time']);

        return response()->json([
            'post'    => $post,
            'related' => $related,
        ]);
    }

    public function faq(): JsonResponse
    {
        $categories = FaqCategory::with(['items' => function ($q) {
            $q->where('is_active', true)->orderBy('order');
        }])
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($categories);
    }

    public function investment(): JsonResponse
    {
        $units = UnitType::where('is_active', true)
            ->orderBy('order')
            ->get();

        $amenities = Amenity::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json([
            'units'     => $units,
            'amenities' => $amenities,
        ]);
    }

    public function about(): JsonResponse
    {
        $trackRecords = TrackRecord::where('is_active', true)
            ->orderBy('order')
            ->get();

        $coreValues = CoreValue::where('is_active', true)
            ->orderBy('order')
            ->get();

        $stats = Stat::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->groupBy('group');

        return response()->json([
            'track_records' => $trackRecords,
            'core_values'   => $coreValues,
            'stats'         => $stats,
        ]);
    }

    public function social(): JsonResponse
    {
        $links = SocialLink::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($links);
    }

    public function blogCategories(): JsonResponse
    {
        $categories = BlogCategory::withCount(['posts' => function ($q) {
            $q->where('is_published', true);
        }])->get();

        return response()->json($categories);
    }
}
