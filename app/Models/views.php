<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class views extends Model
{
    protected $fillable = [
        'user_id',
        'news_id',
    ];
}
