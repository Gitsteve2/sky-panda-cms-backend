<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'company', 'role', 'location', 'avatar',
        'testimonial', 'photos', 'rating', 'investment_amount',
        'monthly_income', 'years_investing', 'order', 'status',
        'is_active', 'source', 'ip_address', 'approved_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'rating' => 'float',
        'photos' => 'array',
        'years_investing' => 'integer',
        'order' => 'integer',
        'approved_at' => 'datetime',
    ];

    public static function sanitizeText(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $clean = strip_tags($value);
        $clean = preg_replace('/\s+/u', ' ', $clean) ?? $clean;
        $clean = trim($clean);

        return $clean !== '' ? $clean : null;
    }

    public static function normalizeRating(mixed $value): float
    {
        $num = is_numeric($value) ? (float) $value : 5.0;
        $clamped = max(0.5, min(5.0, $num));

        return round($clamped * 2) / 2;
    }
}
