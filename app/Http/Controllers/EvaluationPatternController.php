<?php

namespace App\Http\Controllers;

use App\Models\EvaluationPattern;
use App\Models\HumanFactor;
use App\Models\UiTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EvaluationPatternController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = EvaluationPattern::with(['humanFactor', 'uiTags'])
            ->orderBy('h_id');

        if ($request->filled('category') && $request->category !== 'all') {
            $query->whereHas('humanFactor', function ($q) use ($request) {
                $q->where('category', $request->category);
            });
        }

        if ($request->filled('human_factor_id') && $request->human_factor_id !== 'all') {
            $query->where('human_factor_id', $request->human_factor_id);
        }

        if ($request->filled('tag_slug') && $request->tag_slug !== 'all') {
            $query->whereHas('uiTags', function ($q) use ($request) {
                $q->where('slug', $request->tag_slug);
            });
        }
        $heuristics_all = EvaluationPattern::all();

        $evaluation_patterns = $query->get();

        $heuristics_all = EvaluationPattern::with(['humanFactor', 'uiTags'])->get();

        $humanFactors = HumanFactor::orderBy('id')->get();

        $tags = UiTag::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('EvaluationPattern/EPIndex', [
            'evaluation_patterns' => $evaluation_patterns,
            'heuristics_all' => $heuristics_all,
            'human_factors' => $humanFactors,
            'tags' => $tags,
            'filters' => [
                'category' => $request->input('category', 'all'),
                'human_factor_id' => $request->input('human_factor_id', 'all'),
                'tag_slug' => $request->input('tag_slug', 'all'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
