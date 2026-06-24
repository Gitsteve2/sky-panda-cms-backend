<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitType extends Model
{
    protected $fillable = [
        'type', 'size', 'bedrooms', 'bathrooms', 'price_label', 'price_value',
        'all_cash_price', 'booking_fee', 'monthly_rent_label', 'monthly_rent_value',
        'yield_range', 'total_units', 'available_units', 'featured_image',
        'gallery', 'features', 'order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'gallery' => 'array',
        'features' => 'array',
    ];
}
