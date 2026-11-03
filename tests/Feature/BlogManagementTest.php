<?php

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->superAdminRole = Role::firstOrCreate(
        ['name' => 'super_admin'],
        ['display_name' => 'Super Admin', 'description' => 'Full access']
    );

    $this->admin = User::factory()->create([
        'name' => 'Jane Admin',
        'email' => 'jane@pandatowers.africa',
        'is_active' => true,
    ]);
    $this->admin->roles()->sync([$this->superAdminRole->id]);
});

test('admin can view blog management dashboard', function () {
    $category = BlogCategory::create([
        'name' => 'Market Insights',
        'slug' => 'market-insights',
        'color' => '#10B981',
    ]);

    BlogPost::create([
        'title' => 'Nairobi Real Estate Outlook',
        'blog_category_id' => $category->id,
        'author_id' => $this->admin->id,
        'author_name' => 'Jane Admin',
        'content' => '<p>Detailed market analysis content.</p>',
        'is_published' => true,
        'published_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->get('/cms/blog');

    $response->assertOk();
});

test('admin can create and publish a blog article with all fields and auto defaults', function () {
    $category = BlogCategory::create([
        'name' => 'Investment Guides',
        'slug' => 'investment-guides',
        'color' => '#3B82F6',
    ]);

    $response = $this->actingAs($this->admin)->post('/cms/blog', [
        'title' => 'How Rental Yields Build Generational Wealth',
        'slug' => '',
        'excerpt' => '',
        'content' => '<p>Investing in off-plan apartments along Waiyaki Way provides strong rental returns and capital growth.</p>',
        'featured_image' => '/storage/media/blog/sample-cover.jpg',
        'read_time' => '',
        'blog_category_id' => (string) $category->id,
        'author_id' => (string) $this->admin->id,
        'author_name' => 'Panda Towers Research',
        'is_featured' => true,
        'is_published' => true,
        'meta_title' => 'Rental Yields Guide',
        'meta_description' => 'Learn how rental yields work in Nairobi.',
    ]);

    $response->assertRedirect('/cms/blog');

    $post = BlogPost::where('title', 'How Rental Yields Build Generational Wealth')->first();
    expect($post)->not->toBeNull()
        ->and($post->slug)->toBe('how-rental-yields-build-generational-wealth')
        ->and($post->author_name)->toBe('Panda Towers Research')
        ->and($post->blog_category_id)->toBe($category->id)
        ->and($post->is_published)->toBeTrue()
        ->and($post->is_featured)->toBeTrue()
        ->and($post->published_at)->not->toBeNull()
        ->and($post->read_time)->toBe('1 min read')
        ->and($post->excerpt)->toContain('Investing in off-plan apartments');
});

test('creating article with none category and duplicate title generates unique slug cleanly', function () {
    BlogPost::create([
        'title' => 'Duplicate Title Test',
        'content' => '<p>First article</p>',
        'is_published' => false,
    ]);

    $response = $this->actingAs($this->admin)->post('/cms/blog', [
        'title' => 'Duplicate Title Test',
        'blog_category_id' => 'none',
        'author_id' => 'custom',
        'author_name' => 'Guest Writer',
        'content' => '<p>Second article</p>',
        'is_published' => false,
    ]);

    $response->assertRedirect('/cms/blog');

    $second = BlogPost::where('author_name', 'Guest Writer')->first();
    expect($second)->not->toBeNull()
        ->and($second->slug)->toBe('duplicate-title-test-2')
        ->and($second->blog_category_id)->toBeNull();
});

test('admin can edit an article and transition from draft to published', function () {
    $post = BlogPost::create([
        'title' => 'Draft Article',
        'content' => '<p>Initial draft content</p>',
        'is_published' => false,
        'published_at' => null,
    ]);

    $response = $this->actingAs($this->admin)->put("/cms/blog/{$post->id}", [
        'title' => 'Updated & Published Article',
        'slug' => 'updated-published-article',
        'excerpt' => 'Updated summary.',
        'content' => '<p>Updated full content body.</p>',
        'featured_image' => '/exterior.jpg',
        'read_time' => '4 min read',
        'blog_category_id' => 'none',
        'author_id' => (string) $this->admin->id,
        'author_name' => 'Jane Admin',
        'is_featured' => true,
        'is_published' => true,
    ]);

    $response->assertRedirect('/cms/blog');

    $post->refresh();
    expect($post->title)->toBe('Updated & Published Article')
        ->and($post->is_published)->toBeTrue()
        ->and($post->published_at)->not->toBeNull()
        ->and($post->featured_image)->toBe('/exterior.jpg');
});

test('admin can toggle publish and featured status and delete articles', function () {
    $post = BlogPost::create([
        'title' => 'Toggle Test Article',
        'content' => '<p>Body</p>',
        'is_published' => false,
        'is_featured' => false,
    ]);

    $this->actingAs($this->admin)->patch("/cms/blog/{$post->id}/toggle-publish")->assertRedirect();
    expect($post->fresh()->is_published)->toBeTrue()
        ->and($post->fresh()->published_at)->not->toBeNull();

    $this->actingAs($this->admin)->patch("/cms/blog/{$post->id}/toggle-featured")->assertRedirect();
    expect($post->fresh()->is_featured)->toBeTrue();

    $this->actingAs($this->admin)->delete("/cms/blog/{$post->id}")->assertRedirect('/cms/blog');
    expect(BlogPost::find($post->id))->toBeNull();
});

test('admin can upload blog cover image via media endpoint', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('panda-cover.jpg', 1200, 630);

    $response = $this->actingAs($this->admin)->postJson('/cms/media', [
        'file' => $file,
        'collection' => 'blog',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['id', 'name', 'url', 'mime_type', 'size', 'collection']);

    expect($response->json('collection'))->toBe('blog');
    Storage::disk('public')->assertExists($response->json('path'));
});

test('published articles automatically appear on public API and public blog page while drafts are hidden', function () {
    $category = BlogCategory::create([
        'name' => 'Property Investment',
        'slug' => 'property-investment',
        'color' => '#F59E0B',
    ]);

    $published = BlogPost::create([
        'title' => 'Published Panda Article',
        'slug' => 'published-panda-article',
        'blog_category_id' => $category->id,
        'author_id' => $this->admin->id,
        'author_name' => 'Panda Towers Research',
        'excerpt' => 'Published excerpt',
        'content' => '<p>Published content with <img src="/storage/media/blog/inline.jpg" /></p>',
        'featured_image' => '/storage/media/blog/cover.jpg',
        'is_published' => true,
        'published_at' => now(),
    ]);

    $draft = BlogPost::create([
        'title' => 'Secret Draft Article',
        'slug' => 'secret-draft-article',
        'content' => '<p>Draft content</p>',
        'is_published' => false,
    ]);

    // 1. Check /api/v1/blog
    $apiList = $this->getJson('/api/v1/blog');
    $apiList->assertOk();
    $titles = collect($apiList->json('data'))->pluck('title')->all();
    expect($titles)->toContain('Published Panda Article')
        ->and($titles)->not->toContain('Secret Draft Article');

    // Featured image starting with /storage/ is resolved to full URL for external frontend compatibility
    $firstItem = collect($apiList->json('data'))->firstWhere('id', $published->id);
    expect($firstItem['featured_image'])->toStartWith('http')
        ->and($firstItem['author']['name'])->toBe('Panda Towers Research');

    // 2. Check /api/v1/blog/{id} and /api/v1/blog/{slug}
    $this->getJson("/api/v1/blog/{$published->id}")
        ->assertOk()
        ->assertJsonPath('post.title', 'Published Panda Article')
        ->assertJsonPath('post.author.name', 'Panda Towers Research');

    $this->getJson("/api/v1/blog/{$published->slug}")
        ->assertOk()
        ->assertJsonPath('post.id', $published->id);

    // Draft should return 404 on public API
    $this->getJson("/api/v1/blog/{$draft->id}")->assertNotFound();

    // 3. Check public web pages /blog and /blog/{slug}
    $this->get('/blog')->assertOk();
    $this->get("/blog/{$published->slug}")->assertOk();
    $this->get("/blog/{$draft->slug}")->assertNotFound();

    // Logged-in admin CAN preview draft on /blog/{slug}
    $this->actingAs($this->admin)->get("/blog/{$draft->slug}")->assertOk();
});

