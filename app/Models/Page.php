<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'meta_title',
        'meta_description', 'og_image', 'is_published', 'is_system',
    ];

    protected $casts = ['is_published' => 'boolean', 'is_system' => 'boolean'];

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('order');
    }
}
