<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $news = News::with(['author', 'likes', 'views'])->latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $news,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'category' => 'required|in:nasional, politik, kesehatan, olahraga, ekonomi, sains, hukum',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $news = new News();
        $news->title = $request->title;
        $news->content = $request->content;
        $news->category = $request->category;
        $news->author_id = Auth::id();
        $news->status = 'draft';

        // Upload image, save to storage
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news_images', 'public');
            $news->image = $imagePath;

            $news->save();
            return response()->json(['message' => 'News created successfully'], 201);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $news = News::with(['author', 'likes', 'views'])->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $news,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(News $news)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        //check just the author can update the news
        if ($news->author_id != Auth::id()) {
            return response()->json(['message' => 'You are not authorized to update this news'], 403);
        }

        $news->update($request->all());
        return response()->json(['message' => 'News updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);

        //check just author and admin can delete the news
        if ($news->author_id != Auth::id() && Auth::user()->role != 'admin') {
            return response()->json(['message' => 'You are not authorized to delete this news'], 403);
        }

        $news->delete();
        return response()->json(['message' => 'News deleted successfully'], 200);
    }

    public function approve($id, Request $request)
    {
        $news = News::findOrFail($id);

        if (Auth::user()->role != 'admin') {
            return response()->json(['message' => 'You are not authorized to approve this news'], 403);
        }

        $status = $request->input('status');
        $news->status = $status;
        $news->approved_by = Auth::id();

        if ($status == 'published') {
            $news->published_at = now();
        }

        $news->save();
        return response()->json(['message' => 'News approved successfully'], 200);
    }
}
