<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $published = News::where('author_id', $userId)->where('status', 'approved')->count();
        $pending = News::where('author_id', $userId)->where('status', 'pending')->count();
        $draft = News::where('author_id', $userId)->where('status', 'draft')->count();

        return Inertia::render('Author/Dashboard', [
            'stats' => [
                'published' => $published,
                'pending' => $pending,
                'draft' => $draft,
            ],
        ]);
    }
}
