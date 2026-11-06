<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Stat;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/testimonials/index', [
            'testimonials' => Testimonial::orderByRaw("CASE WHEN status = 'pending' THEN 0 WHEN status = 'approved' THEN 1 ELSE 2 END")
                ->orderBy('order')
                ->orderByDesc('created_at')
                ->get(),
            'stats' => Stat::where('group', 'testimonials')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->sanitizeRequest($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:2048',
            'testimonial' => 'required|string|max:2000',
            'photos' => 'nullable|array|max:3',
            'photos.*' => 'nullable|string|max:2048',
            'rating' => 'required|numeric|min:0.5|max:5',
            'investment_amount' => 'nullable|string|max:100',
            'monthly_income' => 'nullable|string|max:100',
            'years_investing' => 'nullable|integer|min:0',
            'order' => 'nullable|integer',
            'status' => 'nullable|in:pending,approved,rejected',
            'is_active' => 'boolean',
        ]);

        $status = $data['status'] ?? 'approved';
        $isActive = $status === 'approved' ? (bool) ($data['is_active'] ?? true) : false;

        $photos = is_array($data['photos'] ?? null)
            ? array_values(array_filter(array_map('trim', $data['photos']), fn ($p) => $p !== ''))
            : [];

        $data['rating'] = Testimonial::normalizeRating($data['rating']);
        $data['photos'] = $photos !== [] ? array_slice($photos, 0, 3) : null;
        $data['status'] = $status;
        $data['is_active'] = $isActive;
        $data['source'] = 'cms';
        $data['years_investing'] = (int) ($data['years_investing'] ?? 1);
        $data['order'] = (int) ($data['order'] ?? ((Testimonial::max('order') ?? 0) + 1));
        $data['approved_at'] = $status === 'approved' ? now() : null;

        Testimonial::create($data);

        return back()->with('success', 'Feedback entry created successfully.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $this->sanitizeRequest($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:2048',
            'testimonial' => 'required|string|max:2000',
            'photos' => 'nullable|array|max:3',
            'photos.*' => 'nullable|string|max:2048',
            'rating' => 'required|numeric|min:0.5|max:5',
            'investment_amount' => 'nullable|string|max:100',
            'monthly_income' => 'nullable|string|max:100',
            'years_investing' => 'nullable|integer|min:0',
            'order' => 'nullable|integer',
            'status' => 'nullable|in:pending,approved,rejected',
            'is_active' => 'boolean',
        ]);

        $status = $data['status'] ?? $testimonial->status ?? 'approved';
        $isActive = $status === 'approved' ? (bool) ($data['is_active'] ?? $testimonial->is_active) : false;

        if (array_key_exists('photos', $data)) {
            $photos = is_array($data['photos'])
                ? array_values(array_filter(array_map('trim', $data['photos']), fn ($p) => $p !== ''))
                : [];
            $data['photos'] = $photos !== [] ? array_slice($photos, 0, 3) : null;
        }

        $data['rating'] = Testimonial::normalizeRating($data['rating']);
        $data['status'] = $status;
        $data['is_active'] = $isActive;
        $data['years_investing'] = (int) ($data['years_investing'] ?? $testimonial->years_investing ?? 1);
        $data['order'] = (int) ($data['order'] ?? $testimonial->order ?? 0);

        if ($status === 'approved' && $testimonial->approved_at === null) {
            $data['approved_at'] = now();
        } elseif ($status !== 'approved') {
            $data['approved_at'] = null;
        }

        $testimonial->update($data);

        return back()->with('success', "Feedback from \"{$testimonial->name}\" updated successfully.");
    }

    public function approve(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $publish = $request->boolean('publish', true);

        $testimonial->update([
            'status' => 'approved',
            'is_active' => $publish,
            'approved_at' => $testimonial->approved_at ?? now(),
        ]);

        $message = $publish
            ? "Feedback from \"{$testimonial->name}\" has been approved and published to the homepage."
            : "Feedback from \"{$testimonial->name}\" has been approved (currently unpublished).";

        return back()->with('success', $message);
    }

    public function reject(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update([
            'status' => 'rejected',
            'is_active' => false,
            'approved_at' => null,
        ]);

        return back()->with('success', "Feedback from \"{$testimonial->name}\" has been rejected and hidden from the website.");
    }

    public function togglePublish(Testimonial $testimonial): RedirectResponse
    {
        $newPublished = ! $testimonial->is_active;

        $updates = [
            'is_active' => $newPublished,
        ];

        if ($newPublished) {
            $updates['status'] = 'approved';
            if ($testimonial->approved_at === null) {
                $updates['approved_at'] = now();
            }
        }

        $testimonial->update($updates);

        $message = $newPublished
            ? "Feedback from \"{$testimonial->name}\" is now published on the homepage."
            : "Feedback from \"{$testimonial->name}\" has been unpublished from the homepage.";

        return back()->with('success', $message);
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:testimonials,id',
            'action' => 'required|in:approve,publish,unpublish,reject,delete',
        ]);

        $ids = $data['ids'];
        $count = count($ids);

        if ($data['action'] === 'delete') {
            if (! $request->user()?->isSuperAdmin() && ! $request->user()?->hasPermission('testimonials.delete')) {
                abort(403, 'You do not have permission to delete testimonials.');
            }
            Testimonial::whereIn('id', $ids)->delete();

            return back()->with('success', "{$count} feedback item(s) deleted permanently.");
        }

        if (! $request->user()?->isSuperAdmin() && ! $request->user()?->hasPermission('testimonials.edit')) {
            abort(403, 'You do not have permission to edit testimonials.');
        }

        if ($data['action'] === 'approve') {
            Testimonial::whereIn('id', $ids)->update([
                'status' => 'approved',
                'approved_at' => now(),
            ]);

            return back()->with('success', "{$count} feedback item(s) approved.");
        }

        if ($data['action'] === 'publish') {
            Testimonial::whereIn('id', $ids)->update([
                'status' => 'approved',
                'is_active' => true,
                'approved_at' => now(),
            ]);

            return back()->with('success', "{$count} feedback item(s) approved and published to the homepage.");
        }

        if ($data['action'] === 'unpublish') {
            Testimonial::whereIn('id', $ids)->update([
                'is_active' => false,
            ]);

            return back()->with('success', "{$count} feedback item(s) unpublished from the homepage.");
        }

        Testimonial::whereIn('id', $ids)->update([
            'status' => 'rejected',
            'is_active' => false,
            'approved_at' => null,
        ]);

        return back()->with('success', "{$count} feedback item(s) rejected.");
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $name = $testimonial->name;
        $testimonial->delete();

        return back()->with('success', "Feedback from \"{$name}\" deleted.");
    }

    private function sanitizeRequest(Request $request): void
    {
        $fields = ['name', 'email', 'phone', 'company', 'role', 'location', 'testimonial', 'investment_amount', 'monthly_income'];
        $merged = [];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                $val = $request->input($field);
                $merged[$field] = is_string($val) ? Testimonial::sanitizeText($val) : $val;
            }
        }

        if ($merged !== []) {
            $request->merge($merged);
        }
    }
}
