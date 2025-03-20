<?php

namespace App\Http\Controllers;

use App\Models\views;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ViewsController extends Controller
{
    //add view to news
    public function addView($id)
    {
        $news = News::findOrFail($id);
        $user_id = Auth::id();

        views::create([
            'news_id' => $news->id,
            'user_id' => $user_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'View added successfully'
        ]);
    }
    //add view count from news
    public function getViews($id)
    {
        $count = views::where('news_id', $id)->count();
        return response()->json(['views' => $count]);
    }
}
