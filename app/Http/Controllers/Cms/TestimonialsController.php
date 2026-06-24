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
            'testimonials' => Testimonial::orderBy('order')->get(),
            'stats' => Stat::where('group', 'testimonials')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|string',
            'testimonial' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'investment_amount' => 'nullable|string|max:100',
            'monthly_income' => 'nullable|string|max:100',
            'years_investing' => 'integer|min:0',
            'order' => 'integer',
        ]);

        Testimonial::create($data);

        return back()->with('success', 'Testimonial added.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|string',
            'testimonial' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'investment_amount' => 'nullable|string|max:100',
            'monthly_income' => 'nullable|string|max:100',
            'years_investing' => 'integer|min:0',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $testimonial->update($data);

        return back()->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Testimonial deleted.');
    }
}
