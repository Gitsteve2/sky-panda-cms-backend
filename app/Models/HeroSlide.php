<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'badge_text', 'heading', 'heading_highlight', 'subheading',
        'cta_text', 'cta_url', 'cta_target', 'secondary_cta_text', 'secondary_cta_url',
        'background_type', 'background_src', 'background_poster',
        'overlay_color', 'order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];
}
