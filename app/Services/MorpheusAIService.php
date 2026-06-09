<?php
namespace App\Services;

use App\Ai\Agents\MorpheusAgent;
use App\Ai\Agents\TestAgent;
use App\Models\AgentConversation;
use App\Models\Artifact;
use App\Models\EvaluationPattern;
use App\Models\Finding;
use App\Models\Task;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Laravel\Ai\Attributes\MaxSteps;
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Temperature;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Attributes\UseCheapestModel;
use Laravel\Ai\Attributes\UseSmartestModel;

use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Files\Image;


#[MaxSteps(10)]
#[MaxTokens(4096)]
#[Temperature(0.7)]

class MorpheusAIService
{
    public function providerMap(string $provider)
    {
        return match ($provider) {
            'openai' => Lab::OpenAI,
            'anthropic' => Lab::Anthropic,
            'groq' => Lab::Groq,
            'gemini' => Lab::Gemini,
        };
    }

    /**
     * @throws \Throwable
     */
    public function startAudit(User $user, string $provider, string $agent_model, array $evaluationPatterns, Task $task)
    {



        Log::info("🚀 [MORPHEUS-AI] INIZIO Analisi per Task ID: {$task->id}");

        if ($evaluationPatterns == []) {
            $evaluationPatterns =  EvaluationPattern::all();
            Log::info("📋 [MORPHEUS-AI] Selected Evaluation Patterns: ALL");
        } else {
            Log::info("📋 [MORPHEUS-AI] Selected Evaluation Patterns: " . implode(', ', $evaluationPatterns));
            $evaluationPatterns = EvaluationPattern::whereIn('id', $evaluationPatterns)->get();
        }

        if ($evaluationPatterns->isEmpty()) {
            Log::error("❌ [MORPHEUS-AI] Analisi interrupted: no evaluation patterns found in database.");
            return;
        }

        $totalPatterns = $evaluationPatterns->count();

        $this->updateAuditProgress(
            task: $task,
            status: 'running',
            current: 0,
            total: $totalPatterns,
            message: 'Preparation of images and context...',
        );

        $artifacts = $task->artifacts()->orderBy('created_at', 'asc')->get();
        $preparedArtifacts = [];

        foreach ($artifacts as $index => $artifact) {

            if (Storage::disk('public')->exists($artifact->file_path)) {
                $preparedArtifacts[] = [
                    'image_number' => count($preparedArtifacts) + 1,
                    'artifact_id' => $artifact->id,
                    'page_url' => $artifact->page_url,
                    'attachment' => Image::fromStorage(
                        $artifact->file_path,
                        disk: 'public',
                    ),
                ];
            }
        }
        $attachments = array_column($preparedArtifacts, 'attachment');
        if (empty($preparedArtifacts)) {
            Log::error("❌ [MORPHEUS-AI] Analysis interrupted: no image found for task (.{$task->id} ");
            return;
        }


        Finding::where('task_id', $task->id)->delete();

        $conversation = null;
        $conversationId = null;

        foreach ($evaluationPatterns as $idx => $pattern) {

            $this->updateAuditProgress(
                task: $task,
                status: 'running',
                current: $idx + 1,
                total: $totalPatterns,
                message: "Analysing {$pattern->h_id}: {$pattern->title}",
            );

            Log::info("[MORPHEUS-AI] Analyzing {$pattern->h_id} (" . ($idx + 1) . "/{$totalPatterns})");

            $studyCase = $task->studyCase;

            // CANCELLA I VECCHI FINDING PRIMA DI INIZIARE

            $prompt = "---System Context---\n";
            $prompt .= "1. System Name: {$studyCase->system_name}\n";
            $prompt .= "2. System Type: {$studyCase->system_type}\n";
            $prompt .= "3. Main Device: {$studyCase->main_device}\n";
            $prompt .= "4. Sector: {$studyCase->sector}\n";
            $prompt .= "5. Risk Level: {$studyCase->risk_level}\n";
            $prompt .= "6. Main Device: {$studyCase->main_device}\n";


            $prompt .= "---User Context---\n";
            $prompt .= "1. User Type: {$task->user_type}\n";
            $prompt .= "2. User Role: {$task->user_role}\n";
            $prompt .= "3. User Intent: {$task->user_intent}\n";
            $prompt .= "4. Stress Level: {$task->stress_level}\n";
            $prompt .= "5. Cost of Error: {$task->cost_of_error}\n";

            $prompt .= "---HEURISTIC UNDER EVALUATION---\n";
            $prompt .= "[ID]: {$pattern->h_id}\n";
            $prompt .= "[TRIGGER/RULE]: {$pattern->audit_rule}\n";
            $prompt .= "[DETAIL]: {$pattern->trigger}\n";

            $prompt .= "---RELATION >> IMAGE - ARTIFACT ID---";
            foreach ($preparedArtifacts as $preparedArtifact) {
                $prompt .= "Image {$preparedArtifact['image_number']} = ARTIFACT_ID: {$preparedArtifact['artifact_id']}\n";
                if ($preparedArtifact['page_url'] != null) {
                    $prompt .= "Relative URL: {$preparedArtifact['page_url']}\n";
                } else {
                    $prompt .= "No URL available for this image.\n";
                }
                $prompt .= "----------------------\n";
            }

            $prompt .= "--- OUTPUT INSTRUCTIONS AND TEMPORAL AWARENESS ---
                1. SINGLE-IMAGE ANALYSIS: Look for the violation in EACH individual image, analyzing ONLY the portion of the screen that contains the interface.
                2. FLOW ANALYSIS (MULTI-STEP): Evaluate the user’s entire “journey.” If you notice an interaction problem distributed across multiple pages (e.g. an unnecessary process, loss of context between two steps), you MUST report it.


                if you DON'T find any violation, set violation_found: false and findings: [].";


            try {
                if ($conversationId === null) {
                    $response = (new MorpheusAgent)
                        ->forUser($user)
                        ->prompt(
                            $prompt,
                            attachments: $attachments,
                            provider: $this->providerMap("openai"),
                            //model: $agent_model,
                        );
                    $conversationId = $response->conversationId;

                    $conversation = AgentConversation::query()
                        ->whereKey($conversationId)
                        ->first();

                    if ($conversation !== null) {
                        $conversation->update([
                            'task_id' => $task->id,
                        ]);
                    }
                } else {
                    $response = (new MorpheusAgent)
                        ->continue($conversationId, as: $user,)
                        ->prompt(
                            $prompt,
                            attachments: $attachments,
                            provider: $this->providerMap($provider),
                            //model: $agent_model,
                        );
                }
                if (isset($response['result']) && ($response['violation_found'] ?? false)) {
                    $result = $response['result'];

                    $finding = Finding::create([
                        'title' => $result['title'],
                        'description' => $result['description'],
                        'task_id' => $task->id,
                        'artifact_id' => $result['artifact_id'],
                        'internal_reasoning' => $result['internal_reasoning'],
                        'pragmatic_explanation' => $result['pragmatic_explanation'],
                        'impact' => $result['impact'],
                        'severity' => $result['severity'],
                        'executive_question' => $pattern->org_question,
                    ]);
                    $finding->evaluationPatterns()->attach($pattern->id);
                    Log::info("🚨 [MORPHEUS-AI] Saved finding for {$pattern->h_id} on artifact {$result['artifact_id']}");
                }

//                  In caso la risposta non sia annidata usare direttamente il risultato
//                Finding::create([
//                    'study_case_id' => $studyCase->id,
//                    'artifact_id' => $response['artifact_id'],
//                    'evaluation_pattern_id' => $pattern->id,
//                    'visual_element_description' => $response['visual_element_description'],
//                    'internal_reasoning' => $response['internal_reasoning'],
//                    'pragmatic_explanation' => $response['pragmatic_explanation'],
//                    'severity' => $response['severity'],
//                    'executive_question' => $pattern->org_question,
//                ]);

            } catch (\Throwable $e) {
                Log::error("❌ [MORPHEUS-AI] API ERROR for {$pattern->h_id}: " . $e->getMessage());

                $this->updateAuditProgress(
                    task: $task,
                    status: 'running',
                    current: $idx + 1,
                    total: $totalPatterns,
                    message: "Error on {$pattern->h_id}, continuing with next pattern...",
                    error: str($e->getMessage())->limit(1000)->toString(),
                );

                continue;
            }
        }

        if ($conversation !== null) {
            $messages = $conversation->messages()->get();

            foreach ($messages as $message) {
                $message->update(['task_id' => $task->id]);
            }
        }

        if ($conversation === null) {
            Cache::forget("task_{$task->id}_progress");

            Log::error("❌ [MORPHEUS-AI] Analysis failed: no conversation was created.");

            return;
        }

        $task->forceFill([
            'audit_status' => 'completed',
            'audit_current' => $totalPatterns,
            'audit_total' => $totalPatterns,
            'audit_message' => 'Audit completed.',
            'audit_error' => null,
            'audit_completed_at' => now(),
        ])->save();

        Cache::put("task_{$task->id}_progress", [
            'status' => 'completed',
            'current' => $totalPatterns,
            'total' => $totalPatterns,
            'message' => 'Audit completed.',
            'error' => null,
        ], 3600);

        Log::info("🏁 [MORPHEUS-AI] Analysis completed.");

    }

    private function updateAuditProgress(
        Task $task,
        string $status,
        int $current,
        int $total,
        string $message,
        ?string $error = null,
    ): void {
        Cache::put("task_{$task->id}_progress", [
            'status' => $status,
            'current' => $current,
            'total' => $total,
            'message' => $message,
            'error' => $error,
        ], 3600);

        $task->forceFill([
            'audit_status' => $status,
            'audit_current' => $current,
            'audit_total' => $total,
            'audit_message' => $message,
            'audit_error' => $error,
        ])->save();
    }

    public function continueConversationt(User $user, Task $task, string $prompt, Finding $selectedFinding = null, EvaluationPattern $selectedEvaluationPattern = null)
    {


        $conversation = $task->conversation;

        $initialPrompt = "The user is asking for more detailed information about the analysis you made.\n";
        $initialPrompt .= "He may ask general question or more information relative to a violation you found and maybe on why you flagged as violation.\n";
        if ($selectedFinding !== null) {
            $initialPrompt .= "Selected finding for evaluation:\n";
            $initialPrompt .= "[ID]: {$selectedFinding->id}\n";
            $initialPrompt .= "[Artifact ID]: {$selectedFinding->artifact_id}\n";
            $initialPrompt .= "[Title]: {$selectedFinding->title}\n";
            $initialPrompt .= "[Description]: {$selectedFinding->description}\n";
            $initialPrompt .= "[Attack Scenario]: {$selectedFinding->attack_scenario}\n";
            $initialPrompt .= "[Impact]: {$selectedFinding->impact}\n";
            $initialPrompt .= "[Severity]: {$selectedFinding->severity}\n";
            $initialPrompt .= "The image/artifact relative to this finding will be provided as an attachment.\n\n";
            $artifact = $selectedFinding->load('artifact');
            $attachment = Image::fromStorage($artifact->file_path, disk: 'public');
            if ($selectedEvaluationPattern !== null) {
                $initialPrompt .= "Relative Evaluation Pattern:\n";
                $initialPrompt .= "[ID]: {$selectedFinding->h_id}\n";
                $initialPrompt .= "[TRIGGER/RULE]: {$selectedFinding->audit_rule}\n";
                $initialPrompt .= "[DETAIL]: {$selectedFinding->trigger}\n\n";
            }
        }

        $initialPrompt .= "User prompt:\n";
        $initialPrompt .= $prompt;


        ///////////////////////////////////////////////// STATIC MODEL PROVIDE TO MOVE TO CONTROLLER
        $provider = $conversation->provider;
        $model = $conversation->model;


        $response = MorpheusAgent::make()
            ->continue($conversation->id, as: $user)
            ->prompt(
                $initialPrompt,
                attachments: [$attachment],
                provider: $this->providerMap($provider),
                model: $model,
            );


        return response()->json([
            'response' => $response['value'],
        ]);
    }
}
