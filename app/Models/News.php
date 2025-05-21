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
        return $this->hasMany(likes::class);
    }

    public function views()
    {
        return $this->hasMany(views::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function approver()
    {
        return $this->hasMany(User::class, 'approved_by');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
