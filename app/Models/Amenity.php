<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $fillable = ['name', 'icon', 'image', 'description', 'order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
