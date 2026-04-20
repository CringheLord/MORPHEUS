<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\StudyCase;

class StudyCaseController extends Controller
{
    public function index()
    {
        $studyCases = StudyCase::with('owner')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('study-cases/Index', [
            'StudyCases' => $studyCases,
        ]);
    }

    public function create()
    {
        return Inertia::render('StudyCases/Create');
    }

    public function show(StudyCase $studyCase)
    {
        return Inertia::render('StudyCases/Show', [
        ]);
    }

    public function edit(StudyCase $studyCase)
    {
        return Inertia::render('StudyCases/Edit', [
        ]);
    }
}
