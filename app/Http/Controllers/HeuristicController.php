<?php

namespace App\Http\Controllers;

use App\Models\Heuristic;
use App\Models\HumanFactor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HeuristicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $heuristics = Heuristic::with('humanFactor')
            ->orderBy('h_id')
            ->paginate(4);
        $heuristics_all = Heuristic::all();
        $humanFactors = HumanFactor::
            orderBy('id')
            ->get();

        return Inertia::render('Heuristics/Index', [
            'heuristics' => $heuristics,
            'heuristics_all' => $heuristics_all,
            'human_factors' => $humanFactors,
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
