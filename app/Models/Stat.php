<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stat extends Model
{
    protected $fillable = ['group', 'icon', 'value', 'label', 'description', 'order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
