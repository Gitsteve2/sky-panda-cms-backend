<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\NavigationItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NavigationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/navigation/index', [
            'items' => NavigationItem::whereNull('parent_id')->with('children')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'label' => 'required|string|max:255',
            'path' => 'required|string|max:500',
            'type' => 'in:internal,external',
            'target' => 'in:_self,_blank',
            'order' => 'integer',
            'is_active' => 'boolean',
            'show_in_mobile' => 'boolean',
            'parent_id' => 'nullable|exists:navigation_items,id',
        ]);

        NavigationItem::create($data);

        return back()->with('success', 'Navigation item added.');
    }

    public function update(Request $request, NavigationItem $navigationItem): RedirectResponse
    {
        $data = $request->validate([
            'label' => 'required|string|max:255',
            'path' => 'required|string|max:500',
            'type' => 'in:internal,external',
            'target' => 'in:_self,_blank',
            'order' => 'integer',
            'is_active' => 'boolean',
            'show_in_mobile' => 'boolean',
            'parent_id' => 'nullable|exists:navigation_items,id',
        ]);

        $navigationItem->update($data);

        return back()->with('success', 'Navigation item updated.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($data['items'] as $item) {
            NavigationItem::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Navigation reordered.');
    }

    public function destroy(NavigationItem $navigationItem): RedirectResponse
    {
        $navigationItem->delete();

        return back()->with('success', 'Navigation item deleted.');
    }
}
