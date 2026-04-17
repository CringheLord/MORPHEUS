<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\StudyCase;

class StudyCaseController extends Controller
{
    public function index()
    {
        return Inertia::render('StudyCases/Index', [
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
