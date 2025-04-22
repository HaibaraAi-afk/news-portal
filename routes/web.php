<?php

use App\Http\Controllers\NewsController;
use App\Http\Controllers\ViewsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LikesController;


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth');
Route::get('/check-email', [AuthController::class, 'checkEmail']);

Route::get('/news', [NewsController::class, 'index']);
Route::post('/news', [NewsController::class, 'store'])->middleware('auth:sanctum');
Route::patch('/news/{id}', [NewsController::class, 'update']);
Route::delete('/news/{id}', [NewsController::class, 'destroy']);
Route::post('/news/{id}/approve', [NewsController::class, 'approve']);

Route::post('/news/{id}/like', [LikesController::class, 'likeNews']);
Route::get('/news/{id}/likes', [LikesController::class, 'getLikes']);

Route::post('/news/{id}/view', [ViewsController::class, 'addView']);
Route::get('/news/{id}/views', [ViewsController::class, 'getViews']);



Route::get('/', function () {
    return Inertia::render('homepage1', [
        'title' => 'NusantaraTimes'
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/news', [NewsController::class, 'index']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
