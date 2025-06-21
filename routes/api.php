<?php

use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LikesController;
use App\Http\Controllers\ViewsController;


Route::get('/news/published', [NewsController::class, 'getPublishedByCategory']);
Route::get('/news/categories', [NewsController::class, 'getAvailableCategories']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/drafts/{id}', [NewsController::class, 'showDraft']);




// api.php
Route::post('/news/{id}/view', [ViewsController::class, 'addView']);
Route::post('/news/{id}/like', [LikesController::class, 'like']);
Route::get('/news/{id}/like-status', [LikesController::class, 'status']);
