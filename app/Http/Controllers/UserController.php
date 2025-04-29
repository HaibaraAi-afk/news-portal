<?php

// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function dashboard()
    {
        $users = Auth::user();

        // if ($users->role === 'admin') {
        //     return Inertia::render('Dashboard/Admin/Index');
        // }

        // if ($users->role === 'author') {
        //     return Inertia::render('Dashboard/Author/Index');
        // }

        return redirect('/');
    }
}
