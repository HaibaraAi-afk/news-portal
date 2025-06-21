<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\News;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index()
    {
        $authors = User::where('role', 'author')->get();
        $pendingNews = News::where('status', 'pending')->get();

        return Inertia::render('Dashboard/Admin/dashboardAdmin', [
            'authors' => $authors,
            'pendingNews' => $pendingNews,
        ]);
    }

    public function addAuthor(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'author',
        ]);

        return back()->with('success', 'Penulis berhasil ditambahkan.');
    }

    public function approveNews(News $news)
    {
        $news->update(['status' => 'approved']);
        return back()->with('success', 'Berita disetujui.');
    }

    public function rejectNews(News $news)
    {
        $news->update(['status' => 'rejected']);
        return back()->with('error', 'Berita ditolak.');
    }

    public function getAdminStats()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'total' => News::whereIn('status', ['approved', 'pending'])->count(),
            'request' => News::where('status', 'pending')->count(),
            'active' => News::where('status', 'approved')->count(),
            'authors' => User::where('role', 'author')->count(),
        ]);
    }


    public function showAddAuthorPage()
    {
        $users = User::all();

        return Inertia::render('Dashboard/Admin/addAuthor', [
            'users' => $users,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function changeRole(Request $request)
    {

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:normal,author,admin',
        ]);

        $user = User::findOrFail($request->user_id);

        // Optional: Cegah admin mengubah dirinya sendiri
        if (Auth::id() === $user->id) {
            return back()->with('error', 'Tidak dapat mengubah role sendiri');
        }
        // Cek apakah role yang diubah adalah admin
        $user->role = $request->role;
        $user->save();

        return back()->with('success', 'Role pengguna berhasil diperbarui');
    }


    public function manageNews()
    {
        // Ambil hanya berita yang sudah approved/publish
        $allNews = News::with('author')
            ->where('status', 'approved')
            ->latest()
            ->get();

        // Tetap ambil berita yang masih pending (jika ingin ditampilkan juga di tab berbeda misalnya)
        $pendingNews = News::with('author')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('Dashboard/Admin/NewsManagement', [
            'allNews' => $allNews,
            'pendingNews' => $pendingNews,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }
}
