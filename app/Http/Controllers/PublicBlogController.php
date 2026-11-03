<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicBlogController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = BlogPost::with(['category', 'author'])
            ->where('is_published', true)
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (BlogPost $post) => $this->formatPost($post));

        $categories = BlogCategory::where('is_active', true)
            ->withCount(['posts' => fn ($q) => $q->where('is_published', true)])
            ->orderBy('order')
            ->get();

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function show(Request $request, string $idOrSlug): Response
    {
        $canPreviewDrafts = $request->user() !== null;

        $query = BlogPost::with(['category', 'author'])
            ->where(function ($q) use ($idOrSlug) {
                if (is_numeric($idOrSlug)) {
                    $q->where('id', (int) $idOrSlug)->orWhere('slug', $idOrSlug);
                } else {
                    $q->where('slug', $idOrSlug);
                }
            });

        if (! $canPreviewDrafts) {
            $query->where('is_published', true);
        }

        $post = $query->firstOrFail();

        $related = BlogPost::with(['category', 'author'])
            ->where('is_published', true)
            ->where('id', '!=', $post->id)
            ->orderByRaw('CASE WHEN blog_category_id = ? THEN 0 ELSE 1 END', [$post->blog_category_id])
            ->orderByDesc('published_at')
            ->limit(2)
            ->get()
            ->map(fn (BlogPost $item) => $this->formatPost($item));

        return Inertia::render('blog/show', [
            'post' => $this->formatPost($post),
            'related' => $related,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatPost(BlogPost $post): array
    {
        $author = $post->author;
        $authorName = $post->author_name ?: ($author !== null ? $author->name : 'Panda Towers Team');
        $publishedDate = $post->published_at ?? $post->created_at;
        $category = $post->category;

        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'featured_image' => $post->featured_image,
            'read_time' => $post->read_time ?: BlogPost::calculateReadTime($post->content),
            'is_featured' => (bool) $post->is_featured,
            'is_published' => (bool) $post->is_published,
            'published_at' => $publishedDate !== null ? $publishedDate->toISOString() : null,
            'meta_title' => $post->meta_title ?: $post->title,
            'meta_description' => $post->meta_description ?: $post->excerpt,
            'blog_category_id' => $post->blog_category_id,
            'category' => $category !== null ? [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'color' => $category->color,
            ] : null,
            'author_name' => $authorName,
            'author' => [
                'id' => $post->author_id ?? 1,
                'name' => $authorName,
            ],
        ];
    }
}

