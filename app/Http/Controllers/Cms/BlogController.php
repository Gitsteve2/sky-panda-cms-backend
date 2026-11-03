<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BlogController extends Controller
{
    public function index(): Response
    {
        $posts = BlogPost::with(['category', 'author'])
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (BlogPost $post) {
                $author = $post->author;
                $post->author_name = $post->author_name ?: ($author !== null ? $author->name : 'Panda Towers Team');
                $post->read_time = $post->read_time ?: BlogPost::calculateReadTime($post->content);

                return $post;
            });

        return Inertia::render('cms/blog/index', [
            'posts' => $posts,
            'categories' => BlogCategory::withCount('posts')->orderBy('order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cms/blog/form', [
            'post' => null,
            'categories' => BlogCategory::orderBy('order')->get(),
            'authors' => User::where('is_active', true)->orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->normalizeInputs($request);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string|max:2048',
            'read_time' => 'nullable|string|max:100',
            'blog_category_id' => 'nullable|exists:blog_categories,id',
            'author_id' => 'nullable|exists:users,id',
            'author_name' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $data['slug'] = BlogPost::generateUniqueSlug(($data['slug'] ?? '') ?: $data['title']);
        $data = $this->populatePostDefaults($data);

        $post = BlogPost::create($data);

        $message = $post->is_published
            ? "Article \"{$post->title}\" has been published and is now live on the website."
            : "Article \"{$post->title}\" has been saved as a draft.";

        return redirect()->route('cms.blog.index')->with('success', $message);
    }

    public function edit(BlogPost $blogPost): Response
    {
        $blogPost->load(['category', 'author']);
        $author = $blogPost->author;
        $authUser = auth()->user();
        $blogPost->author_name = $blogPost->author_name ?: ($author !== null ? $author->name : ($authUser !== null ? $authUser->name : 'Panda Towers Team'));

        return Inertia::render('cms/blog/form', [
            'post' => $blogPost,
            'categories' => BlogCategory::orderBy('order')->get(),
            'authors' => User::where('is_active', true)->orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function update(Request $request, BlogPost $blogPost): RedirectResponse
    {
        $this->normalizeInputs($request);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string|max:2048',
            'read_time' => 'nullable|string|max:100',
            'blog_category_id' => 'nullable|exists:blog_categories,id',
            'author_id' => 'nullable|exists:users,id',
            'author_name' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $data['slug'] = BlogPost::generateUniqueSlug(($data['slug'] ?? '') ?: $data['title'], $blogPost->id);
        $data = $this->populatePostDefaults($data, $blogPost);

        $blogPost->update($data);

        return redirect()->route('cms.blog.index')->with('success', "Article \"{$blogPost->title}\" updated successfully.");
    }

    public function togglePublish(BlogPost $blogPost): RedirectResponse
    {
        $newStatus = ! $blogPost->is_published;
        $updates = ['is_published' => $newStatus];

        if ($newStatus && empty($blogPost->published_at)) {
            $updates['published_at'] = now();
        }

        $blogPost->update($updates);

        $message = $newStatus
            ? "Article \"{$blogPost->title}\" is now published on the website."
            : "Article \"{$blogPost->title}\" has been unpublished and moved to drafts.";

        return back()->with('success', $message);
    }

    public function toggleFeatured(BlogPost $blogPost): RedirectResponse
    {
        $newFeatured = ! $blogPost->is_featured;
        $blogPost->update(['is_featured' => $newFeatured]);

        $message = $newFeatured
            ? "Article \"{$blogPost->title}\" marked as featured."
            : "Article \"{$blogPost->title}\" removed from featured.";

        return back()->with('success', $message);
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:blog_posts,id',
            'action' => 'required|in:publish,unpublish,delete',
        ]);

        $ids = $data['ids'];
        $count = count($ids);

        if ($data['action'] === 'delete') {
            if (! $request->user()?->isSuperAdmin() && ! $request->user()?->hasPermission('blog.delete')) {
                abort(403, 'You do not have permission to delete articles.');
            }
            BlogPost::whereIn('id', $ids)->delete();

            return back()->with('success', "{$count} article(s) deleted permanently.");
        }

        if (! $request->user()?->isSuperAdmin() && ! $request->user()?->hasPermission('blog.edit')) {
            abort(403, 'You do not have permission to edit articles.');
        }

        if ($data['action'] === 'publish') {
            BlogPost::whereIn('id', $ids)->whereNull('published_at')->update([
                'is_published' => true,
                'published_at' => now(),
            ]);
            BlogPost::whereIn('id', $ids)->update(['is_published' => true]);

            return back()->with('success', "{$count} article(s) published to the website.");
        }

        BlogPost::whereIn('id', $ids)->update(['is_published' => false]);

        return back()->with('success', "{$count} article(s) unpublished and moved to drafts.");
    }

    public function destroy(BlogPost $blogPost): RedirectResponse
    {
        $title = $blogPost->title;
        $blogPost->delete();

        return redirect()->route('cms.blog.index')->with('success', "Article \"{$title}\" deleted.");
    }

    public function downloadGuide(): BinaryFileResponse
    {
        $path = public_path('docs/Panda-Towers-Blog-Admin-Guide.pdf');
        abort_unless(file_exists($path), 404, 'Administrator Guide PDF not found.');

        return response()->download($path, 'Panda-Towers-Blog-Admin-Guide.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }

    // Categories
    public function categories(): Response
    {
        return Inertia::render('cms/blog/categories', [
            'categories' => BlogCategory::withCount('posts')->orderBy('order')->get(),
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        $data['slug'] = $this->generateUniqueCategorySlug(($data['slug'] ?? '') ?: $data['name']);
        $data['color'] = ($data['color'] ?? '') ?: '#16a34a';
        $data['order'] = (BlogCategory::max('order') ?? 0) + 1;

        $category = BlogCategory::create($data);

        if ($request->wantsJson()) {
            return response()->json($category);
        }

        return back()->with('success', "Category \"{$category->name}\" created.");
    }

    public function updateCategory(Request $request, BlogCategory $blogCategory): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        $data['slug'] = $this->generateUniqueCategorySlug(($data['slug'] ?? '') ?: $data['name'], $blogCategory->id);

        $blogCategory->update($data);

        return back()->with('success', "Category \"{$blogCategory->name}\" updated.");
    }

    public function destroyCategory(BlogCategory $blogCategory): RedirectResponse
    {
        $name = $blogCategory->name;
        $blogCategory->delete();

        return back()->with('success', "Category \"{$name}\" deleted.");
    }

    private function normalizeInputs(Request $request): void
    {
        if (in_array($request->input('blog_category_id'), ['none', '', null], true)) {
            $request->merge(['blog_category_id' => null]);
        }

        if (in_array($request->input('author_id'), ['none', 'custom', '', null], true)) {
            $request->merge(['author_id' => null]);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function populatePostDefaults(array $data, ?BlogPost $existing = null): array
    {
        if (empty($data['read_time'])) {
            $data['read_time'] = BlogPost::calculateReadTime(is_string($data['content'] ?? null) ? $data['content'] : '');
        }

        if (empty($data['excerpt']) && ! empty($data['content']) && is_string($data['content'])) {
            $plainText = trim((string) preg_replace('/\s+/', ' ', strip_tags($data['content'])));
            if ($plainText !== '') {
                $data['excerpt'] = Str::limit($plainText, 180);
            }
        }

        if (! empty($data['author_id']) && empty($data['author_name'])) {
            $authorUser = User::whereKey($data['author_id'])->first();
            $data['author_name'] = $authorUser !== null ? $authorUser->name : 'Panda Towers Team';
        } elseif (empty($data['author_id']) && empty($data['author_name'])) {
            $authUser = auth()->user();
            $data['author_id'] = $existing !== null ? $existing->author_id : auth()->id();
            $data['author_name'] = ($existing !== null && $existing->author_name) ? $existing->author_name : ($authUser !== null ? $authUser->name : 'Panda Towers Team');
        }

        $isPublished = (bool) ($data['is_published'] ?? false);
        if ($isPublished && empty($data['published_at'])) {
            $data['published_at'] = ($existing !== null && $existing->published_at !== null) ? $existing->published_at : now();
        }

        return $data;
    }

    private function generateUniqueCategorySlug(string $nameOrSlug, ?int $ignoreId = null): string
    {
        $base = Str::slug($nameOrSlug) ?: 'category';
        $slug = $base;
        $counter = 2;

        while (
            BlogCategory::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
