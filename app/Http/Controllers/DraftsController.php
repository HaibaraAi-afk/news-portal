<?php

namespace App\Http\Controllers;


use App\Models\News;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DraftsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'caption' => 'nullable|string',
            'category' => 'required|string',
            'image' => 'nullable|file|image',
            'status' => 'required|in:draft,pending',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('images', 'public');
        }

        $validated['author_id'] = Auth::id();

        News::create($validated);

        return back()->with('message', 'Draft saved successfully.');
    }
}
