<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'role', 'location', 'avatar', 'testimonial',
        'rating', 'investment_amount', 'monthly_income', 'years_investing',
        'order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean', 'rating' => 'integer'];
}
