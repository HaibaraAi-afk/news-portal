<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    // app/Http/Controllers/HomeController.php
    public function index()
    {
        $topStories = News::where('status', 'approved')
            ->orderBy('likes_count', 'desc')
            ->take(1)
            ->get();
        $recentNews = News::where('status', 'approved')
            ->orderBy('published_at', 'desc')
            ->take(4)
            ->get();

        $popularNews = News::where('status', 'approved')
            ->orderBy('likes_count', 'desc')
            ->take(4)
            ->get();

        // Perbaikan: Gunakan where('category', 'Nasional')
        $nasionalNews = News::where('status', 'approved')
            ->where('category', 'Nasional')
            ->orderBy('published_at', 'desc')
            ->take(9)
            ->get()
            ->toArray(); // Tambahkan ini untuk memastikan data dikonversi ke array
        return Inertia::render('homepage', [
            'topStories' => $topStories->toArray(),
            'recentNews' => $recentNews->toArray(),
            'popularNews' => $popularNews->toArray(),
            'nasionalNews' => $nasionalNews,
            'auth' => [
                'user' => Auth::user() ? collect(Auth::user())->only(['id', 'name', 'email', 'role']) : null,
            ],
        ]);
    }
}
