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

        // Cek existing view dari IP yang sama dalam 24 jam
        $existingView = views::where('news_id', $news->id)
            ->where('ip_address', request()->ip())
            ->where('created_at', '>', now()->subDay())
            ->exists();

        if (!$existingView) {
            views::create([
                'news_id' => $news->id,
                'ip_address' => request()->ip(),
                'user_id' => Auth::id()
            ]);

            News::where('id', $id)->increment('views_count');
        }

        return response()->noContent();
    }
    //add view count from news
    public function getViews($id)
    {
        $count = views::where('news_id', $id)->count();
        return response()->json(['views' => $count]);
    }
}
