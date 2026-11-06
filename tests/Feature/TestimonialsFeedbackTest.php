<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->superAdminRole = Role::firstOrCreate(
        ['name' => 'super_admin'],
        ['display_name' => 'Super Admin', 'description' => 'Full access']
    );

    $this->admin = User::factory()->create([
        'name' => 'Admin User',
        'email' => 'admin@pandatowers.africa',
        'is_active' => true,
    ]);
    $this->admin->roles()->sync([$this->superAdminRole->id]);
});

test('public visitor can submit feedback with half-star rating, required email, optional phone/company, and up to 3 photos', function () {
    Storage::fake('public');

    $photo1 = UploadedFile::fake()->image('site-visit-1.jpg', 800, 600);
    $photo2 = UploadedFile::fake()->image('site-visit-2.png', 800, 600);

    $response = $this->post('/api/v1/testimonials', [
        'name' => '  <b>Michael Ochieng</b>  ',
        'email' => 'Michael.Ochieng@Example.com',
        'phone' => '+254 712 345 678',
        'company' => '',
        'role' => 'Site Visitor',
        'location' => 'Westlands, Nairobi',
        'testimonial' => 'Visited the Panda Towers site along Waiyaki Way and was very impressed by the location and plans.',
        'rating' => 4.5,
        'photos' => [$photo1, $photo2],
    ], ['Accept' => 'application/json']);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Michael Ochieng')
        ->assertJsonPath('data.rating', 4.5)
        ->assertJsonPath('data.status', 'pending');

    $feedback = Testimonial::where('name', 'Michael Ochieng')->first();
    expect($feedback)->not->toBeNull()
        ->and($feedback->email)->toBe('michael.ochieng@example.com')
        ->and($feedback->phone)->toBe('+254 712 345 678')
        ->and($feedback->company)->toBeNull()
        ->and($feedback->rating)->toBe(4.5)
        ->and($feedback->photos)->toBeArray()
        ->and($feedback->photos)->toHaveCount(2)
        ->and($feedback->status)->toBe('pending')
        ->and($feedback->is_active)->toBeFalse()
        ->and($feedback->source)->toBe('website');
});

test('public feedback endpoint requires email and rejects more than 3 photos or non-0.5 star ratings', function () {
    Storage::fake('public');

    // Missing email
    $this->postJson('/api/v1/testimonials', [
        'name' => 'No Email User',
        'testimonial' => 'This is a valid length feedback message without email.',
        'rating' => 4.5,
    ])->assertStatus(422);

    // Invalid rating increment (e.g. 4.3)
    $this->postJson('/api/v1/testimonials', [
        'name' => 'Bad Rating User',
        'email' => 'user@example.com',
        'testimonial' => 'This is a valid length feedback message with 4.3 rating.',
        'rating' => 4.3,
    ])->assertStatus(422);

    // More than 3 photos
    $this->post('/api/v1/testimonials', [
        'name' => 'Too Many Photos',
        'email' => 'photos@example.com',
        'testimonial' => 'Uploading four photos when the limit is three photos.',
        'rating' => 5.0,
        'photos' => [
            UploadedFile::fake()->image('1.jpg'),
            UploadedFile::fake()->image('2.jpg'),
            UploadedFile::fake()->image('3.jpg'),
            UploadedFile::fake()->image('4.jpg'),
        ],
    ], ['Accept' => 'application/json'])->assertStatus(422);
});

test('public feedback endpoint rejects honeypot spam and URLs', function () {
    $this->postJson('/api/v1/testimonials', [
        'name' => 'Spam Bot',
        'email' => 'bot@example.com',
        'testimonial' => 'Great investment opportunity in Nairobi with high returns.',
        'rating' => 5,
        'website' => 'https://spambot.example.com',
    ])->assertStatus(422);

    $this->postJson('/api/v1/testimonials', [
        'name' => 'Promo Spammer',
        'email' => 'promo@example.com',
        'testimonial' => 'Visit https://cheap-crypto-scam.example.com for more offers today!',
        'rating' => 5,
    ])->assertStatus(422);

    expect(Testimonial::count())->toBe(0);
});

test('only approved and published testimonials are returned on public API and email/phone remain private', function () {
    $published = Testimonial::create([
        'name' => 'Approved & Published Visitor',
        'email' => 'private@example.com',
        'phone' => '+254700000000',
        'company' => 'Alpha Ventures',
        'role' => 'Visitor',
        'location' => 'Nairobi',
        'testimonial' => 'Visible testimonial on the homepage for all visitors.',
        'photos' => ['/storage/feedback/sample.jpg'],
        'rating' => 3.5,
        'status' => 'approved',
        'is_active' => true,
    ]);

    Testimonial::create([
        'name' => 'Pending Visitor',
        'email' => 'pending@example.com',
        'testimonial' => 'Should not appear until approved by admin.',
        'rating' => 5,
        'status' => 'pending',
        'is_active' => false,
    ]);

    $response = $this->getJson('/api/v1/testimonials');
    $response->assertOk();

    $data = $response->json();
    expect($data)->toHaveCount(1)
        ->and($data[0]['id'])->toBe($published->id)
        ->and($data[0]['rating'])->toBe(3.5)
        ->and($data[0])->not->toHaveKey('email')
        ->and($data[0])->not->toHaveKey('phone')
        ->and($data[0]['created_at'])->not->toBeNull();
});

test('cms admin can approve, publish, unpublish, reject, edit, bulk-manage, and delete feedback', function () {
    $this->postJson('/api/v1/feedback', [
        'name' => 'Peter Kamau',
        'email' => 'peter@kamaulogistics.co.ke',
        'phone' => '+254 722 999 888',
        'company' => 'Kamau Logistics',
        'role' => 'Site Visitor',
        'location' => 'Kiambu',
        'testimonial' => 'Visited the Kinoo site along Waiyaki Way and was very impressed by the location and plans.',
        'rating' => 4.5,
    ])->assertCreated();

    $item = Testimonial::where('email', 'peter@kamaulogistics.co.ke')->firstOrFail();
    expect($item->status)->toBe('pending')
        ->and($item->rating)->toBe(4.5)
        ->and($item->is_active)->toBeFalse();

    $this->actingAs($this->admin)
        ->patch("/cms/testimonials/{$item->id}/approve", ['publish' => true])
        ->assertRedirect();

    $item->refresh();
    expect($item->status)->toBe('approved')
        ->and($item->is_active)->toBeTrue();

    $this->actingAs($this->admin)
        ->put("/cms/testimonials/{$item->id}", [
            'name' => 'Peter Kamau',
            'email' => 'peter@kamaulogistics.co.ke',
            'phone' => '+254 722 999 888',
            'company' => 'Kamau Logistics Kenya Ltd',
            'role' => 'Founder & CEO',
            'location' => 'Nairobi, Kenya',
            'testimonial' => 'Visited the Kinoo site along Waiyaki Way and reserved two studio units.',
            'photos' => ['/exterior.jpg', '', ''],
            'rating' => 3.5,
            'order' => 1,
            'status' => 'approved',
            'is_active' => true,
        ])
        ->assertRedirect();

    $item->refresh();
    expect($item->rating)->toBe(3.5)
        ->and($item->photos)->toBe(['/exterior.jpg']);
});

test('editor without delete permission cannot delete testimonials', function () {
    $viewPerm = Permission::firstOrCreate(['name' => 'testimonials.view'], ['display_name' => 'View', 'module' => 'Testimonials']);
    $editPerm = Permission::firstOrCreate(['name' => 'testimonials.edit'], ['display_name' => 'Edit', 'module' => 'Testimonials']);

    $editorRole = Role::firstOrCreate(['name' => 'editor'], ['display_name' => 'Editor']);
    $editorRole->permissions()->sync([$viewPerm->id, $editPerm->id]);

    $editor = User::factory()->create(['is_active' => true]);
    $editor->roles()->sync([$editorRole->id]);

    $t = Testimonial::create([
        'name' => 'Protected Testimonial',
        'testimonial' => 'Should not be deletable by editor role.',
        'rating' => 4.5,
        'status' => 'approved',
        'is_active' => true,
    ]);

    $this->actingAs($editor)
        ->delete("/cms/testimonials/{$t->id}")
        ->assertForbidden();
});
