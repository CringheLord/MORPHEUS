<?php

use App\Http\Controllers\StudyCaseController;
use App\Http\Controllers\HeuristicController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    //Heuristics
    Route::get('heuristics', [HeuristicController::class, 'index'])->name('heuristics.index');
    //Study Cases
    Route::get('study-cases', [StudyCaseController::class, 'index'])->name('study-cases.index');


});

require __DIR__.'/settings.php';
