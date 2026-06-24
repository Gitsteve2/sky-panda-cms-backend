<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/blog/index', [
            'posts' => BlogPost::with('category')->orderByDesc('created_at')->get(),
            'categories' => BlogCategory::orderBy('order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cms/blog/form', [
            'post' => null,
            'categories' => BlogCategory::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'read_time' => 'nullable|string',
            'blog_category_id' => 'nullable|exists:blog_categories,id',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
        ]);

        $data['slug'] = Str::slug($data['slug'] ?? $data['title']);
        if (empty($data['published_at']) && $data['is_published']) {
            $data['published_at'] = now();
        }

        BlogPost::create($data);

        return redirect()->route('cms.blog.index')->with('success', 'Blog post created.');
    }

    public function edit(BlogPost $blogPost): Response
    {
        return Inertia::render('cms/blog/form', [
            'post' => $blogPost,
            'categories' => BlogCategory::orderBy('order')->get(),
        ]);
    }

    public function update(Request $request, BlogPost $blogPost): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'read_time' => 'nullable|string',
            'blog_category_id' => 'nullable|exists:blog_categories,id',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $blogPost->update($data);

        return redirect()->route('cms.blog.index')->with('success', 'Blog post updated.');
    }

    public function destroy(BlogPost $blogPost): RedirectResponse
    {
        $blogPost->delete();

        return redirect()->route('cms.blog.index')->with('success', 'Blog post deleted.');
    }

    // Categories
    public function categories(): Response
    {
        return Inertia::render('cms/blog/categories', [
            'categories' => BlogCategory::withCount('posts')->orderBy('order')->get(),
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);
        $data['slug'] = Str::slug($data['slug'] ?? $data['name']);

        BlogCategory::create($data);

        return back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, BlogCategory $blogCategory): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $blogCategory->update($data);

        return back()->with('success', 'Category updated.');
    }

    public function destroyCategory(BlogCategory $blogCategory): RedirectResponse
    {
        $blogCategory->delete();

        return back()->with('success', 'Category deleted.');
    }
}
