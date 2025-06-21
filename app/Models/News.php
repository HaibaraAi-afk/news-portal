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
        'category',
        'caption',
        'published_at',
        'status',
    ];

    // Removed duplicate author() method

    public function likes()
    {
        return $this->hasMany(likes::class, 'news_id');
    }

    public function views()
    {
        return $this->hasMany(views::class, 'news_id');
    }

    public function approver()
    {
        return $this->hasMany(User::class, 'approved_by');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Accessor untuk like count
    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }

    // Accessor untuk view count
    public function getViewsCountAttribute()
    {
        return $this->views()->count();
    }
}
