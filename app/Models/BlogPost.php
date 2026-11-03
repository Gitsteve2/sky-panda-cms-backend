<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    protected $fillable = [
        'blog_category_id', 'author_id', 'author_name', 'title', 'slug', 'excerpt',
        'content', 'featured_image', 'read_time', 'is_featured', 'is_published',
        'published_at', 'meta_title', 'meta_description', 'order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public static function generateUniqueSlug(string $titleOrSlug, ?int $ignoreId = null): string
    {
        $base = Str::slug($titleOrSlug);
        if ($base === '') {
            $base = 'article-' . Str::lower(Str::random(6));
        }

        $slug = $base;
        $counter = 2;

        while (
            static::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public static function calculateReadTime(?string $content): string
    {
        $plain = trim(strip_tags((string) $content));
        if ($plain === '') {
            return '1 min read';
        }
        $words = str_word_count($plain);
        $minutes = max(1, (int) ceil($words / 200));

        return "{$minutes} min read";
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $post) {
            $post->slug = static::generateUniqueSlug($post->slug ?: $post->title);
            if (empty($post->read_time) && ! empty($post->content)) {
                $post->read_time = static::calculateReadTime($post->content);
            }
        });
    }
}
