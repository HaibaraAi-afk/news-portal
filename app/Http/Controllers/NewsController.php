<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($request->query('drafts') == '1') {
            $news = News::where('status', 'draft')
                ->where('author_id', $user->id)
                ->latest()->get();
        } else {
            $news = News::where('author_id', $user->id)->latest()->get();
        }

        return Inertia::render('Posts/Index', [
            'news' => $news,
            'user' => $user,
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'caption' => 'nullable|string',
            'category' => 'required|string',
            'status' => 'required|string|in:draft,pending,approved,rejected',
            'published_at' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('news_images', 'public');
        }
        if ($validated['status'] == 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $validated['author_id'] = Auth::id();
        News::create($validated);

        return to_route('author.posts.index')->with('success', 'Berita berhasil dibuat.');
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $news = News::with(['author', 'likes', 'views'])->find($id);

        return response()->json([
            'status' => 'success',
            'data' => [
                ...$news->toArray(),
                'likes_count' => $news->likes_count,
                'views_count' => $news->views_count,
            ]
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

        if ($news->author_id != Auth::id()) {
            return response()->json(['message' => 'You are not authorized'], 403);
        }
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'caption' => 'nullable|string',
            'category' => 'required|string',
            'status' => 'required|string|in:draft,pending,approved,rejected',
            'published_at' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('news_images', 'public');
        }
        if ($validated['status'] == 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }
        $news->update($validated);

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
            $publishedAt = $request->input('created_at');
            $news->published_at = $publishedAt ? $publishedAt : now();
        }

        $news->save();
        return response()->json(['message' => 'News approved successfully'], 200);
    }

    public function listByAuthor()
    {
        $posts = News::where('author_id', Auth::id())->get();

        return Inertia::render('Dashboard/Author/Posts/index', [
            'posts' => $posts
        ]);
    }

    public function sendToApproval($id)
    {
        $news = News::findOrFail($id);

        if ($news->author_id != Auth::id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Allow both draft and rejected status to be sent for approval
        if (!in_array($news->status, ['draft', 'rejected'])) {
            return response()->json(['message' => 'Hanya draft atau yang ditolak yang bisa dikirim ulang'], 400);
        }

        $news->status = 'pending';
        $news->save();

        return response()->json(['message' => 'Draft berhasil dikirim untuk approval.']);
    }


    // List berita draft milik author
    public function drafts(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = News::where('author_id', Auth::id());

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Sort: Draft first, then Pending, then Approved, then by oldest (created_at ascending)
        $drafts = $query
            ->orderByRaw("FIELD(status, 'rejected', 'draft', 'pending', 'approved') asc")
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Dashboard/Author/Posts/drafts', [
            'drafts' => $drafts,
        ]);
    }


    public function showDraft($id)
    {
        $news = News::where('id', $id)
            ->where('author_id', Auth::id())
            ->whereIn('status', ['draft', 'rejected'])
            ->firstOrFail();

        return response()->json([
            'id' => $news->id,
            'title' => $news->title,
            'content' => $news->content,
            'caption' => $news->caption,
            'category' => $news->category,
            'created_at' => $news->created_at,
            'updated_at' => $news->updated_at,
            'published_at' => $news->published_at
        ]);
    }


    public function getPublishedByCategory(Request $request)
    {
        $category = ($request->query('category'));

        $allowedCategories = ['Nasional', 'Politik', 'Kesehatan', 'Olahraga', 'Ekonomi', 'Sains', 'Hukum'];

        if (!in_array($category, $allowedCategories)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid category.',
            ], 400);
        }

        $news = News::with('author')
            ->where('status', 'approved')
            ->where('category', $category)
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $news,
        ]);
    }


    public function getStats()
    {
        $user = Auth::user();

        $stats = [
            'published' => News::where('author_id', $user->id)->where('status', 'approved')->count(),
            'pending' => News::where('author_id', $user->id)->where('status', 'pending')->count(),
            'draft' => News::where('author_id', $user->id)->where('status', 'draft')->count(),
        ];

        return response()->json($stats);
    }


    public function getAvailableCategories()
    {
        $categories = ['Nasional', 'Politik', 'Kesehatan', 'Olahraga', 'Ekonomi', 'Sains', 'Hukum'];

        return response()->json($categories);
    }

    public function getPendingNews()
    {
        $news = News::with('author')
            ->where('status', 'pending')
            ->select(['id', 'title', 'content', 'image', 'author_id', 'category', 'status', 'created_at'])
            ->get();

        return response()->json(['news' => $news]);
    }

    public function showByCategory($category)
    {
        $categoryFormatted = ucfirst(strtolower($category));
        $news = News::where('status', 'approved')
            ->where('category', $categoryFormatted)
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('HomePage', [
            'news' => $news,
            'selectedCategory' => $categoryFormatted,
            'topStories' => $this->getTopStories(),
            'recentNews' => $this->getRecentNews(),
            'popularNews' => $this->getPopularNews(),
            'nasionalNews' => $this->getNasionalNews(),
        ]);
    }

    // Add these methods to avoid undefined method errors
    protected function getTopStories()
    {
        return News::where('status', 'approved')
            ->orderBy('views_count', 'desc')
            ->take(5)
            ->get();
    }

    protected function getRecentNews()
    {
        return News::where('status', 'approved')
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get();
    }

    protected function getPopularNews()
    {
        return News::where('status', 'approved')
            ->orderBy('likes_count', 'desc')
            ->take(5)
            ->get();
    }

    protected function getNasionalNews()
    {
        return News::where('status', 'approved')
            ->where('category', 'Nasional')
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get();
    }
}
