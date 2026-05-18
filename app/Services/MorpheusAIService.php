<?php
namespace App\Services;

use App\Ai\Agents\MorpheusAgent;
use App\Models\Artifact;
use App\Models\EvaluationPattern;
use App\Models\Finding;
use App\Models\Task;
use App\Models\User;

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
#[Timeout(120)]

class MorpheusAIService
{
    public function providerMap ( string $provider )
    {
        return match ($provider) {
            'openai' => Lab::OpenAI,
            'anthropic' => Lab::Anthropic,
            'groq' => Lab::Groq,
            'gemini' => Lab::Gemini,
        };
    }

    public function  agentNewRun ( User $user, string $provider, string $agent_model, array $evaluationPattern, Artifact $artifact, bool $isUrl, string $url, Task $task, string $message, bool $useCheapest  )
    {


        $user = Auth::user();

        Log::info("🚀 [MORPHEUS-AI] INIZIO Analisi per Task ID: {$task->id}");

        if ($evaluationPattern == []) {
            $evaluationPattern = Artifact::all();
            Log::info("📋 [MORPHEUS-AI] Selected Evaluation Patterns: ALL");
        }else {
            Log::info("📋 [MORPHEUS-AI] Selected Evaluation Patterns: " . implode(', ', $evaluationPattern));
            $evaluationPattern = EvaluationPattern::whereIn('id', $evaluationPattern)->get();
        }

        if ($evaluationPattern->isEmpty()) {
            Log::error("❌ [MORPHEUS-AI] Analisi interrupted: no evaluation patterns found in database.");
            return;
        }

        $totalPatterns = $evaluationPattern->count();

        $initCache = [
            'current' => 0,
            'total' => $totalPatterns,
            'message' => 'Preparation of immages and context...'
        ];
        Cache::put("task_{$task->id}_progress", $initCache, 600);

        $artifacts = $task->artifacts()->orderBy('created_at', 'asc')->get();
        $preparedArtifacts = [];

        foreach ($artifacts as $index => $artifact) {

            if (Storage::disk('public')->exists($artifact->file_path)) {
                $preparedArtifacts[] = [
                    'image_number' => count($preparedArtifacts) + 1,
                    'artifact_id' => $artifact->id,
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


        foreach ($evaluationPattern as $idx => $pattern) {

            Cache::put("task_{$task->id}_progress", [
                'current' => $idx + 1,
                'total' => $totalPatterns,
                'message' => "Analysing {$pattern->h_id}: {$pattern->title}"
            ]);

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

            $prompt .= "---PAGE URL---";
            if ($isUrl) {
                $prompt .= "2. URL: {$url}\n";
            } else {
                $prompt .= "2. No URL provided\n";
            }

            $prompt .= "---RELATION >> IMAGE - ARTIFACT ID---";
            foreach ($preparedArtifacts as $preparedArtifact) {
                $prompt .= "Image {$preparedArtifact['image_number']} = ARTIFACT_ID: {$preparedArtifact['artifact_id']}\n";
            }

            $prompt .= "--- OUTPUT INSTRUCTIONS AND TEMPORAL AWARENESS ---
1. SINGLE-IMAGE ANALYSIS: Look for the violation in EACH individual image, analyzing ONLY the portion of the screen that contains the interface.
2. FLOW ANALYSIS (MULTI-STEP): Evaluate the user’s entire “journey.” If you notice an interaction problem distributed across multiple pages (e.g. an unnecessary process, loss of context between two steps), you MUST report it.

WHERE SHOULD THE RED BOX BE PLACED?
The coordinates (x, y, width, height), expressed as percentages, must be calculated over the ENTIRE IMAGE (the whole PDF page), so that the box is positioned correctly over the problematic UI element.
If the error is a “FLOW ERROR,” draw a large red box (e.g. width 80, height 80) on the image representing the final climax of the issue.

Se non trovi NESSUNA violazione, imposta violation_found: false e findings: [].";


            try {
                $response =  (new MorpheusAgent)->forUser($user)->prompt(
                    $prompt,
                    attachments: $attachments,
                    provider: $this->providerMap($provider),
                    model: $agent_model,
                );
                $conversationId = $response->conversationId;

                if (isset($response['result']) && $response['evaluation_found']) {
                    $result = $response['result'];

                    Finding::create([
                        'study_case_id' => $studyCase->id,
                        'artifact_id' => $result['artifact_id'],
                        'evaluation_pattern_id' => $pattern->id,
                        'visual_element_description' => $result['visual_element_description'],
                        'internal_reasoning' => $result['internal_reasoning'],
                        'pragmatic_explanation' => $result['pragmatic_explanation'],
                        'severity' => $result['severity'],
                        'executive_question' => $pattern->org_question,
                    ]);
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

            }catch (\Exception $e) {
                Log::error("❌ [MORPHEUS-AI] API ERROR for {$pattern->h_id}: " . $e->getMessage());
            }

            $task->update(['status' => 'completed']);
            Cache::forget("task_{$task->id}_progress");
            Log::info("🏁 [MORPHEUS-AI] Analysis completed.");

        }





    }

    public function continueConversationt ( string $message, EvaluationPattern $evaluationPattern, Artifact $artifact, Task $task, $conversationId  ) {

        $user = Auth::user();

        $response =  (new MorpheusAgent)
            ->continue($conversationId, as: $user)
            ->prompt(
                $message
            );


    }
}
