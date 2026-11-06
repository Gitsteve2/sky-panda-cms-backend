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
use App\Models\Page;
use App\Models\ProjectUpdate;
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
            // Footer / General
            'interest_form_url', 'footer_description',
            // Project progress
            'project_overall_progress', 'project_expected_completion',
            'project_schedule_status', 'project_total_units', 'project_sold_units',
        ])->pluck('value', 'key');

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
        $testimonials = Testimonial::where('status', 'approved')
            ->where('is_active', true)
            ->orderBy('order')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Testimonial $t) {
                $avatar = $t->avatar;
                if ($avatar && str_starts_with($avatar, '/storage/')) {
                    $avatar = url($avatar);
                }

                $rawPhotos = is_array($t->photos) ? array_slice($t->photos, 0, 3) : [];
                $photos = array_values(array_filter(array_map(function ($photo) {
                    if (! is_string($photo) || trim($photo) === '') {
                        return null;
                    }

                    return str_starts_with($photo, '/storage/') ? url($photo) : $photo;
                }, $rawPhotos)));

                return [
                    'id' => $t->id,
                    'name' => $t->name,
                    'company' => $t->company,
                    'role' => $t->role,
                    'location' => $t->location,
                    'avatar' => $avatar,
                    'testimonial' => $t->testimonial,
                    'photos' => $photos,
                    'rating' => (float) $t->rating,
                    'investment_amount' => $t->investment_amount,
                    'monthly_income' => $t->monthly_income,
                    'years_investing' => $t->years_investing,
                    'order' => (int) $t->order,
                    'created_at' => $t->created_at !== null ? $t->created_at->toISOString() : null,
                ];
            });

        return response()->json($testimonials);
    }

    public function submitTestimonial(Request $request): JsonResponse
    {
        // Honeypot spam protection
        if ($request->filled('website') || $request->filled('honeypot')) {
            return response()->json([
                'message' => 'Invalid submission detected.',
            ], 422);
        }

        // Sanitize inputs prior to validation
        $request->merge([
            'name' => Testimonial::sanitizeText($request->input('name')),
            'email' => Testimonial::sanitizeText($request->input('email')),
            'phone' => Testimonial::sanitizeText($request->input('phone')),
            'company' => Testimonial::sanitizeText($request->input('company')),
            'role' => Testimonial::sanitizeText($request->input('role')),
            'location' => Testimonial::sanitizeText($request->input('location')),
            'testimonial' => Testimonial::sanitizeText($request->input('testimonial')),
        ]);

        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:150'],
            'role' => ['nullable', 'string', 'max:150'],
            'location' => ['nullable', 'string', 'max:150'],
            'testimonial' => ['required', 'string', 'min:15', 'max:1500'],
            'rating' => [
                'required',
                'numeric',
                'min:0.5',
                'max:5',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $num = (float) $value;
                    if (abs(($num * 2) - round($num * 2)) > 0.001) {
                        $fail('The rating must be in 0.5 star increments (e.g., 3.5, 4.0, 4.5, 5.0).');
                    }
                },
            ],
            'photos' => ['nullable', 'array', 'max:3'],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        // Reject spam containing URLs or markup
        if (
            preg_match('/(https?:\/\/|www\.|\[url=|<a\s)/i', (string) $data['testimonial']) === 1
            || preg_match('/(https?:\/\/|www\.)/i', (string) $data['name']) === 1
        ) {
            return response()->json([
                'message' => 'Links and URLs are not permitted in feedback submissions.',
                'errors' => [
                    'testimonial' => ['Links and URLs are not permitted in feedback submissions.'],
                ],
            ], 422);
        }

        // Prevent duplicate rapid submissions
        $recentDuplicate = Testimonial::where('name', $data['name'])
            ->where('testimonial', $data['testimonial'])
            ->where('created_at', '>=', now()->subMinutes(10))
            ->exists();

        if ($recentDuplicate) {
            return response()->json([
                'message' => 'Your feedback has already been submitted and is awaiting review.',
                'errors' => [
                    'testimonial' => ['Duplicate feedback submission detected.'],
                ],
            ], 422);
        }

        $photoPaths = [];
        if ($request->hasFile('photos')) {
            $files = $request->file('photos');
            if (is_array($files)) {
                foreach (array_slice($files, 0, 3) as $file) {
                    if ($file->isValid()) {
                        $stored = $file->store('feedback', 'public');
                        if ($stored !== false) {
                            $photoPaths[] = '/storage/'.$stored;
                        }
                    }
                }
            }
        }

        $maxOrder = (int) (Testimonial::max('order') ?? 0);
        $rating = Testimonial::normalizeRating($data['rating']);

        $testimonial = Testimonial::create([
            'name' => (string) $data['name'],
            'email' => strtolower((string) $data['email']),
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'role' => $data['role'] ?? null,
            'location' => $data['location'] ?? null,
            'testimonial' => (string) $data['testimonial'],
            'photos' => $photoPaths !== [] ? $photoPaths : null,
            'rating' => $rating,
            'years_investing' => 1,
            'order' => $maxOrder + 1,
            'status' => 'pending',
            'is_active' => false,
            'source' => 'website',
            'ip_address' => $request->ip(),
            'approved_at' => null,
        ]);

        return response()->json([
            'message' => 'Thank you for your feedback! Your review has been submitted and will appear on our website once approved.',
            'data' => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'company' => $testimonial->company,
                'role' => $testimonial->role,
                'location' => $testimonial->location,
                'rating' => (float) $testimonial->rating,
                'photos' => $testimonial->photos ?? [],
                'status' => $testimonial->status,
                'created_at' => $testimonial->created_at?->toISOString(),
            ],
        ], 201);
    }

    public function blog(Request $request): JsonResponse
    {
        $query = BlogPost::with(['category', 'author'])
            ->where('is_published', true);

        if ($request->filled('category') && $request->input('category') !== 'all') {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)->orWhere('name', $categorySlug);
            });
        }

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $posts = $query
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate((int) $request->input('per_page', 12))
            ->through(fn (BlogPost $post) => $this->transformBlogPost($post));

        return response()->json($posts);
    }

    public function blogPost(string|int $id): JsonResponse
    {
        $post = BlogPost::with(['category', 'author'])
            ->where('is_published', true)
            ->where(function ($q) use ($id) {
                if (is_numeric($id)) {
                    $q->where('id', (int) $id);
                } else {
                    $q->where('slug', $id);
                }
            })
            ->firstOrFail();

        $related = BlogPost::with(['category', 'author'])
            ->where('is_published', true)
            ->where('id', '!=', $post->id)
            ->orderByRaw('CASE WHEN blog_category_id = ? THEN 0 ELSE 1 END', [$post->blog_category_id])
            ->orderByDesc('published_at')
            ->limit(2)
            ->get()
            ->map(fn (BlogPost $item) => $this->transformBlogPost($item, false));

        return response()->json([
            'post' => $this->transformBlogPost($post, true),
            'related' => $related,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformBlogPost(BlogPost $post, bool $includeFullContent = true): array
    {
        $author = $post->author;
        $authorName = $post->author_name ?: ($author !== null ? $author->name : 'Panda Towers Team');
        $featuredImage = $post->featured_image;
        $publishedDate = $post->published_at ?? $post->created_at;

        if ($featuredImage && str_starts_with($featuredImage, '/storage/')) {
            $featuredImage = url($featuredImage);
        }

        $content = $post->content;
        if ($includeFullContent && $content) {
            $content = preg_replace_callback(
                '/src=["\'](\/storage\/[^"\']+)["\']/i',
                fn ($matches) => 'src="'.url($matches[1]).'"',
                $content
            );
        }

        $data = [
            'id' => $post->id,
            'blog_category_id' => $post->blog_category_id,
            'author_id' => $post->author_id,
            'author_name' => $authorName,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'featured_image' => $featuredImage,
            'read_time' => $post->read_time ?: BlogPost::calculateReadTime($post->content),
            'is_featured' => (bool) $post->is_featured,
            'is_published' => (bool) $post->is_published,
            'published_at' => $publishedDate !== null ? $publishedDate->toISOString() : null,
            'meta_title' => $post->meta_title ?: $post->title,
            'meta_description' => $post->meta_description ?: $post->excerpt,
            'created_at' => $post->created_at !== null ? $post->created_at->toISOString() : null,
            'updated_at' => $post->updated_at !== null ? $post->updated_at->toISOString() : null,
            'category' => $post->category,
            'author' => [
                'id' => $post->author_id ?? 1,
                'name' => $authorName,
            ],
        ];

        if ($includeFullContent) {
            $data['content'] = $content;
        }

        return $data;
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
            'units' => $units,
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
            'core_values' => $coreValues,
            'stats' => $stats,
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

    public function projectUpdates(): JsonResponse
    {
        $updates = ProjectUpdate::where('is_active', true)
            ->orderByDesc('order')
            ->get();

        return response()->json($updates);
    }

    public function pageSections(string $slug): JsonResponse
    {
        $page = Page::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $sections = $page->sections()
            ->where('is_active', true)
            ->orderBy('order')
            ->get(['id', 'name', 'section_type', 'content', 'order', 'background_color', 'background_image', 'css_class']);

        return response()->json($sections);
    }
}
