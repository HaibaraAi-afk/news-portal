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

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function likes()
    {
        return $this->belongsTo(likes::class);
    }

    public function views()
    {
        return $this->belongsTo(views::class);
    }
}
