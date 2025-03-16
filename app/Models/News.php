<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'content',
        'author_id',
        'image',
        'category_id',
        'caption',
        'published_at',
        'status',
    ];
}
