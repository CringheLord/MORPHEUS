<?php

use App\Http\Controllers\QuestionnairesController;
use App\Http\Controllers\StudyCaseController;
use App\Http\Controllers\EvaluationPatternController;
use App\Http\Controllers\ArtifactController;
use App\Http\Controllers\TaskController;
use App\Http\Middleware\SharedQuestionnaire;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    //EvaluationPattern
    Route::get('evaluation-patterns', [EvaluationPatternController::class, 'index'])
        ->name('evaluation-patterns.index');
    //Study Cases
    Route::get('study-cases', [StudyCaseController::class, 'index'])
        ->name('study-cases.index');
    Route::get('study-cases/{studyCase}', [StudyCaseController::class, 'show'])
        ->name('study-cases.show');
    Route::put('study-cases/{studyCase}/edit', [StudyCaseController::class, 'update'])
        ->name('study-cases.update');
    Route::post('study-cases', [StudyCaseController::class, 'create'])
        ->name('study-cases.create');
   // Route::put('study-case/{studyCase}', [StudyCAseController::class, 'update'])->name('study-case.update');
    //Study Cases
    Route::post('study-cases/{studyCase}/tasks', [TaskController::class, 'store'])
        ->name('study-cases.tasks.store');
    Route::put('study-cases/{studyCase}/tasks/{task}', [TaskCOntroller::class, 'update'])
        ->name('study-cases.tasks.update');
    Route::delete('study-cases/{studyCase}', [StudyCaseController::class, 'destroy'])
        ->name('study-cases.destroy');

    Route::get('study-cases/{studyCase}/questionnaires/{questionnaire}', [QuestionnairesController::class, 'show'])
        ->name('study-cases.questionnaires.show');
    Route::post('study-cases/{studyCase}/questionnaires/store', [QuestionnairesController::class, 'store'])
        ->name('study-cases.questionnaires.store');
    Route::put('study-cases/{studyCase}/questionnaires/{questionnaire}/update', [QuestionnairesController::class, 'update'])
        ->name('study-cases.questionnaires.update');


    //Audits / Task
    Route::get('tasks/{task}/audits', [TaskController::class, 'inspect'])
        ->name('tasks.inspect');
    Route::delete('tasks/{task}', [TaskController::class, 'destroy'])
        ->name('tasks.destroy');
    Route::put('tasks/{task}/reset', [TaskController::class, 'reset'])
        ->name('tasks.reset');
    Route::post('tasks/{task}/artifacts', [ArtifactController::class, 'store'])
        ->name('tasks.audits.artifacts.store');
    Route::delete('tasks/{task}/artifacts/{artifact}', [ArtifactController::class, 'destroy'])
        ->name('tasks.audits.artifacts.destroy');
    Route::get('tasks/{task}/report', [TaskController::class, 'generateReport'])
        ->name('tasks.generateReport');

    Route::put('questionnaires/{questionnaire}/share', [QuestionnairesController::class, 'share'])
        ->name('questionnaires.share');
    Route::get('questionnaires/{questionnaire}/results', [QuestionnairesController::class, 'results'])
        ->name('questionnaires.results');
});
//Guest questionnaire page
Route::middleware(SharedQuestionnaire::class)->group(function () {
    Route::get('questionnaires/{questionnaires}/submit/get', [QuestionnairesController::class, 'getSubmit'])
        ->name('questionnaires.get');
    Route::post('questionnaires/{questionnaires}/submit', [QuestionnairesController::class, 'submit'])
        ->name('questionnaires.submit');
});
require __DIR__.'/settings.php';
