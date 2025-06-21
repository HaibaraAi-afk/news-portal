<?php

use App\Http\Controllers\NewsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ViewsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LikesController;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth Routes
Route::post('/check-email', [AuthController::class, 'checkEmail']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/news', [NewsController::class, 'index']);
Route::post('/news', [NewsController::class, 'store'])->middleware('auth:sanctum');
Route::patch('/news/{id}', [NewsController::class, 'update']);
Route::delete('/news/{id}', [NewsController::class, 'destroy']);
Route::post('/news/{id}/approve', [NewsController::class, 'approve']);


Route::post('/news/{id}/like', [LikesController::class, 'like']);
Route::get('/news/{id}/likes', [LikesController::class, 'getLikes']);

Route::post('/news/{id}/view', [ViewsController::class, 'addView']);
Route::get('/news/{id}/views', [ViewsController::class, 'getViews']);



// Routes khusus author
// Route::middleware(['auth'])->group(function () {
//     Route::resource('/posts', NewsController::class)->only(['index', 'store', 'update', 'destroy', 'show']);
//     Route::get('/drafts', [NewsController::class, 'index'])->name('posts.drafts');
// });
// Route::middleware(['auth'])->get(
//     '/Author',
//     fn() =>
//     Inertia::render('Dashboard/Author/dashboardAuthor', [
//         'user' => Auth::user()
//     ])
// )->name('author.dashboard');


Route::get('/news/category/{category}', [NewsController::class, 'showByCategory'])
    ->name('news.category');


Route::get('/news/{id}', function ($id) {
    return Inertia::render('detailNews', [
        'id' => $id
    ]);
});

// Route khusus author
Route::middleware(['auth', 'verified'])->prefix('dashboard/author')->name('author.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Author/dashboard'))->name('author.dashboard');

    Route::get('/stats', [NewsController::class, 'getStats']);

    Route::prefix('posts')->name('posts.')->group(function () {
        Route::get('/', [NewsController::class, 'listByAuthor'])->name('index');
        Route::get('/drafts', [NewsController::class, 'drafts'])->name('drafts');
        Route::get('/drafts/{id}', [NewsController::class, 'showDraft']);
        Route::post('/', [NewsController::class, 'store'])->name('store');
        Route::put('/{id}', [NewsController::class, 'update'])->name('update');
        Route::delete('/{id}', [NewsController::class, 'destroy'])->name('destroy');
        Route::post('/drafts', [NewsController::class, 'store'])->name('drafts.store');
        Route::post('/send-to-approval/{id}', [NewsController::class, 'sendToApproval'])->name('sendToApproval');
    });
});



// Routes khusus admin
Route::middleware(['auth', 'verified'])->prefix('dashboard/admin')->name('admin.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Admin/dashboard'))->name('admin.dashboard');
    Route::get('/stats', [AdminController::class, 'getAdminStats']);

    Route::post('/change-role', [AdminController::class, 'changeRole'])->name('changeRole');
    Route::post('/add-author', [AdminController::class, 'addAuthor'])->name('addAuthor');
    Route::post('/news/{news}/approve', [AdminController::class, 'approveNews'])->name('approveNews');
    Route::post('/news/{news}/reject', [AdminController::class, 'rejectNews'])->name('rejectNews');
    Route::get('/addauthor', [AdminController::class, 'showAddAuthorPage'])->name('addAuthorPage');
    Route::get('/news', [AdminController::class, 'manageNews'])->name('news');
});





Route::get('/news/category/{category}', function ($category) {
    // Konversi ke format dengan huruf kapital di awal
    $categoryFormatted = ucfirst(strtolower($category));

    return Inertia::render('NewsByCategory', [
        'category' => $categoryFormatted,
    ]);
})->name('news.category');



Route::get('/', [HomeController::class, 'index'])->name('/homepage');


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

Route::get('/news', [NewsController::class, 'index']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
