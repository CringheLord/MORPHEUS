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
    Route::get('study-cases/{studyCase}', [StudyCaseController::class, 'show'])->name('study-cases.show');
    Route::put('study-cases/{studyCase}/edit', [StudyCaseController::class, 'update'])->name('study-cases.update');
    Route::post('study-cases', [StudyCaseController::class, 'create'])->name('study-cases.create');
   // Route::put('study-case/{studyCase}', [StudyCAseController::class, 'update'])->name('study-case.update');

});

require __DIR__.'/settings.php';
