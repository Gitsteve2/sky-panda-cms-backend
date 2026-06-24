<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Models\UnitType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvestmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/investment/index', [
            'unitTypes' => UnitType::orderBy('order')->get(),
            'amenities' => Amenity::orderBy('order')->get(),
        ]);
    }

    public function storeUnit(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'type' => 'required|string|max:100',
            'size' => 'nullable|string|max:50',
            'bedrooms' => 'integer|min:0',
            'bathrooms' => 'integer|min:0',
            'price_label' => 'nullable|string|max:50',
            'price_value' => 'integer|min:0',
            'all_cash_price' => 'nullable|integer',
            'booking_fee' => 'nullable|integer',
            'monthly_rent_label' => 'nullable|string|max:50',
            'monthly_rent_value' => 'nullable|integer',
            'yield_range' => 'nullable|string|max:50',
            'total_units' => 'integer|min:0',
            'available_units' => 'integer|min:0',
            'featured_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'features' => 'nullable|array',
            'order' => 'integer',
        ]);

        UnitType::create($data);

        return back()->with('success', 'Unit type added.');
    }

    public function updateUnit(Request $request, UnitType $unitType): RedirectResponse
    {
        $data = $request->validate([
            'type' => 'required|string|max:100',
            'size' => 'nullable|string|max:50',
            'bedrooms' => 'integer|min:0',
            'bathrooms' => 'integer|min:0',
            'price_label' => 'nullable|string|max:50',
            'price_value' => 'integer|min:0',
            'all_cash_price' => 'nullable|integer',
            'booking_fee' => 'nullable|integer',
            'monthly_rent_label' => 'nullable|string|max:50',
            'monthly_rent_value' => 'nullable|integer',
            'yield_range' => 'nullable|string|max:50',
            'total_units' => 'integer|min:0',
            'available_units' => 'integer|min:0',
            'featured_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'features' => 'nullable|array',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $unitType->update($data);

        return back()->with('success', 'Unit type updated.');
    }

    public function destroyUnit(UnitType $unitType): RedirectResponse
    {
        $unitType->delete();

        return back()->with('success', 'Unit type deleted.');
    }

    public function storeAmenity(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:100',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'order' => 'integer',
        ]);

        Amenity::create($data);

        return back()->with('success', 'Amenity added.');
    }

    public function updateAmenity(Request $request, Amenity $amenity): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:100',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $amenity->update($data);

        return back()->with('success', 'Amenity updated.');
    }

    public function destroyAmenity(Amenity $amenity): RedirectResponse
    {
        $amenity->delete();

        return back()->with('success', 'Amenity deleted.');
    }
}
