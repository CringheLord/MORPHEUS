<?php

namespace App\Http\Controllers;

use App\Ai\Agents\TestAgent;
use App\Models\AgentConversation;
use App\Models\EvaluationPattern;
use App\Models\Finding;
use App\Models\Task;
use App\Services\MorpheusAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Ai\Exceptions\ProviderOverloadedException;
use App\Jobs\RunMorpheusAuditJob;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class AIController extends Controller
{
    public function startAudit(Request $request, Task $task, MorpheusAIService $morpheusAIService)
    {

        $validated = $request->validate([
            'provider' => ['required', 'string'],
            'model' => ['required', 'string'],
            'evaluation_pattern_ids' => ['nullable', 'array'],
            'evaluation_pattern_ids.*' => ['integer', 'exists:evaluation_patterns,id'],
        ]);

        if (in_array($task->audit_status, ['queued', 'running'], true)) {
            return back()->withErrors([
                'audit' => 'An audit is already running for this task.',
            ]);
        }

        $task->forceFill([
            'audit_status' => 'queued',
            'audit_current' => 0,
            'audit_total' => 0,
            'audit_message' => 'Audit queued.',
            'audit_error' => null,
            'audit_started_at' => now(),
            'audit_completed_at' => null,
        ])->save();

        Cache::put("task_{$task->id}_progress", [
            'status' => 'queued',
            'current' => 0,
            'total' => 0,
            'message' => 'Audit queued.',
            'error' => null,
        ], 3600);

        RunMorpheusAuditJob::dispatch(
            userId: Auth::id(),
            taskId: $task->id,
            provider: $validated['provider'],
            model: $validated['model'],
            evaluationPatternIds: $validated['evaluation_pattern_ids'] ?? [],
        )->onQueue('morpheus');

        return back()->with('success', 'Audit started successfully.');
    }

    public function continueConversation(Request $request, Task $task, MorpheusAIService $morpheusAIService)
    {
        $user = Auth::user();


        $validated = $request->validate([
            'prompt' => ['required', 'string'],
        ]);

        $selectedFinding = $request['selected_finding'];
        $selectedEvaluationPattern = $request['selected_evaluation_pattern'];
        $selectedFinding = Finding::find($selectedFinding);
        $selectedEvaluationPattern = EvaluationPattern::find($selectedEvaluationPattern);

        return $morpheusAIService->continueConversationt(
            user: $user,
            task: $task,
            prompt: $validated['prompt'],
            selectedFinding: $selectedFinding,
            selectedEvaluationPattern: $selectedEvaluationPattern,
        );

    }

}
