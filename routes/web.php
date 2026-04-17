<?php

use App\Http\Controllers\StudyCaseController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('study-cases', 'study-cases/Index')->name('study-cases.index');
    Route::inertia('heuristics', 'heuristics/Index')->name('heuristics.index');
});

require __DIR__.'/settings.php';
