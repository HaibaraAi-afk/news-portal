<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Likes;
use Illuminate\Support\Facades\Auth;

class LikesController extends Controller
{
    public function like($id)
    {
        $user = Auth::user();

        if (!$user) {
            return back()->with('error', 'You must be logged in to like news.');
        }

        $existingLike = Likes::where('user_id', $user->id)
            ->where('news_id', $id)
            ->first();

        if ($existingLike) {
            return back()->with('error', 'You have already liked this news.');
        }

        Likes::create([
            'user_id' => $user->id,
            'news_id' => $id
        ]);

        $news = News::find($id);
        if ($news) {
            $news->increment('likes_count');
        }

        return back()->with('success', 'News liked successfully.');
    }

    public function status(Request $request, $id)
    {
        $userId = $request->user_id;
        $liked = false;
        $likesCount = 0;

        $news = News::find($id);
        if ($news) {
            $likesCount = $news->likes_count;

            if ($userId) {
                $liked = Likes::where('user_id', $userId)
                    ->where('news_id', $id)
                    ->exists();
            }
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => $likesCount,
        ]);
    }
}
