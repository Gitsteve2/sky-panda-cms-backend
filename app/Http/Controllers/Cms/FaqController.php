<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\FaqCategory;
use App\Models\FaqItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/faq/index', [
            'categories' => FaqCategory::with(['items' => fn ($q) => $q->orderBy('order')])->orderBy('order')->get(),
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);
        $data['slug'] = Str::slug($data['slug'] ?? $data['name']);

        FaqCategory::create($data);

        return back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, FaqCategory $faqCategory): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $faqCategory->update($data);

        return back()->with('success', 'Category updated.');
    }

    public function destroyCategory(FaqCategory $faqCategory): RedirectResponse
    {
        $faqCategory->delete();

        return back()->with('success', 'Category deleted.');
    }

    public function storeItem(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'faq_category_id' => 'nullable|exists:faq_categories,id',
            'question' => 'required|string',
            'answer' => 'required|string',
            'order' => 'integer',
        ]);

        FaqItem::create($data);

        return back()->with('success', 'FAQ item added.');
    }

    public function updateItem(Request $request, FaqItem $faqItem): RedirectResponse
    {
        $data = $request->validate([
            'faq_category_id' => 'nullable|exists:faq_categories,id',
            'question' => 'required|string',
            'answer' => 'required|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $faqItem->update($data);

        return back()->with('success', 'FAQ item updated.');
    }

    public function destroyItem(FaqItem $faqItem): RedirectResponse
    {
        $faqItem->delete();

        return back()->with('success', 'FAQ item deleted.');
    }
}
