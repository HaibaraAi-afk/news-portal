<?php

namespace App\Http\Controllers;

use App\Models\likes;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikesController extends Controller
{
    // like or unlike a news
    public function likeNews($id)
    {
        $news = News::findOrfail($id);
        $user_id = Auth::id();

        //check if the user has already liked the news
        $like = likes::where('user_id', $user_id)->where('news_id', $id)->first();

        if ($like) {
            $like->delete();
            return response()->json(['message' => 'You have unliked the news']);
        } else {
            likes::create(['user_id' => $user_id, 'news_id' => $id]);
            return response()->json(['message' => 'You have liked the news']);
        }
    }

    //get the total likes of the news
    public function getLikes($id)
    {
        $likes = likes::where('news_id', $id)->count();
        return response()->json(['likes' => $likes]);
    }
}
