<?php

namespace App\Jobs;

use App\Models\Task;
use App\Models\User;
use App\Services\MorpheusAIService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\FailOnTimeout;
use Illuminate\Queue\Attributes\Tries;
use Laravel\Ai\Attributes\Timeout;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Throwable;


#[Timeout(1000)]
#[Tries(1)]
#[FailOnTimeout]

class RunMorpheusAuditJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $userId,
        public int $taskId,
        public string $provider,
        public string $model,
        public array $evaluationPatternIds,
    )
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle( MorpheusAIService $morpheusAIService): void
    {
        $user = User::findOrFail($this->userId);
        $task = Task::findOrFail($this->taskId);

        Log::info('[MORPHEUS-JOB] Started', [
            'task_id' => $task->id,
            'user_id' => $user->id,
            'provider' => $this->provider,
            'model' => $this->model,
        ]);

        $morpheusAIService->startAudit(
            user: $user,
            provider: $this->provider,
            agent_model: $this->model,
            evaluationPatterns: $this->evaluationPatternIds,
            task: $task,
        );
    }

    public function failed(Throwable $e): void
    {
        $task = Task::find($this->taskId);

        if ($task !== null) {
            $task->forceFill([
                'audit_status' => 'failed',
                'audit_error' => $e->getMessage(),
                'audit_message' => 'Audit failed.',
                'audit_completed_at' => now(),
            ])->save();

            Cache::put("task_{$task->id}_progress", [
                'status' => 'failed',
                'current' => $task->audit_current,
                'total' => $task->audit_total,
                'message' => 'Audit failed.',
                'error' => $e->getMessage(),
            ], 3600);
        }

        Log::error('[MORPHEUS-JOB] Failed', [
            'task_id' => $this->taskId,
            'error' => $e->getMessage(),
        ]);
    }
}
