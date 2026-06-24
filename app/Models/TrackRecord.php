<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackRecord extends Model
{
    protected $fillable = ['title', 'description', 'icon', 'image', 'order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
