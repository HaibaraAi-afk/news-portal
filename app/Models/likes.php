<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class likes extends Model
{
    protected $fillable = [
        'user_id',
        'news_id',
    ];
}
