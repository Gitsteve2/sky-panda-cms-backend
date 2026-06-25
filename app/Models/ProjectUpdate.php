<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectUpdate extends Model
{
    protected $fillable = [
        'title', 'month', 'location', 'image', 'status',
        'highlight', 'description', 'highlights',
        'is_current_phase', 'order', 'is_active',
    ];

    protected $casts = [
        'highlights'       => 'array',
        'is_current_phase' => 'boolean',
        'is_active'        => 'boolean',
    ];
}
