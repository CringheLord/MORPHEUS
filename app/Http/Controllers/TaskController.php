<?php

namespace App\Http\Controllers;

use App\Models\EvaluationPattern;
use App\Models\StudyCase;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function inspect(  $taskId ) {

        $task = Task::findOrFail($taskId);
        $studyCase = $task->studyCase;
        $evaluationPattern = EvaluationPattern::with('humanFactor', 'uiTags');

        return Inertia::render('audits/InterfaceAudit', [
            'studyCase' => $studyCase,
            'task' => $task,
            'evaluationPattern' => $evaluationPattern,
        ]);
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, StudyCase $studyCase)
    {
        $validated = request()->validate([
            'task_name' => ['required'],['string'],['max:255'],
            'user_type' => ['required'],['string'],['in:novice,average_user,critical_operator'],
            'user_role' => ['required'],['string'],['max:255'],
            'user_intent' => ['required'],['string'],['max:255'],
            'stress_level' => ['required'],['integer'],['min:1'],['max:10'],
            'cost_of_error' => ['required'],['string'],['in:low,medium,high'],
        ]);
        $task = new Task();
        $task->fill($validated);
        $task->study_case_id = $studyCase->id;
        $task->save();

        return back()->with('success', 'Task created successfully.');
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
    public function update(Request $request, StudyCase $studyCase, Task $task)
    {
        $validated = $request->validate([
            'task_name' => ['required'],['string'],['max:255'],
            'user_type' => ['required'],['string'],['in:novice,average_user,expert,critical_operator'],
            'user_role' => ['required'],['string'],['max:255'],
            'user_intent' => ['required'],['string'],['max:255'],
            'stress_level' => ['required'],['integer'],['min:1'],['max:10'],
            'cost_of_error' => ['required'],['string'],['in:low,medium,high'],
        ]);

        if ($task->study_case_id !== $studyCase->id) {
            abort(404, 'Task does not belong to this study case.');
        }

        $task->update($validated);
        return back()->with('success', 'Task updated successfully.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
