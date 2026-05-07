<?php
namespace App\Services;

use App\Ai\Agents\MorpheusAgent;
use App\Models\Artifact;
use App\Models\EvaluationPattern;
use App\Models\Task;
use App\Models\User;

use Laravel\Ai\Attributes\MaxSteps;
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Temperature;
use Laravel\Ai\Attributes\Timeout;

use Laravel\Ai\Enums\Lab;


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

    public function  agentNewRun ( User $user, string $provider, string $agent_model, EvaluationPattern $evaluationPattern = null, Artifact $artifact, bool $isUrl, string $url, Task $task, string $message  )
    {
        if ($evaluationPattern == null) {
            $evaluationPattern = Artifact::all();
        }

        $prompt = "---User Context---\n";
        $prompt .= "1. User: {$user->name}\n";

        if ($isUrl) {
            $prompt .= "2. URL: {$url}\n";
        } else {
            $prompt .= "2. No URL provided\n";
        }

        $prompt .= "

        ...
        ..
        .
        ";


        $response =  (new MorpheusAgent)->prompt(
            $prompt,
            provider: $this->providerMap($provider),
            model: $agent_model,
        );

    }

    public function continueConversationt ( string $message, EvaluationPattern $evaluationPattern, Artifact $artifact, Task $task  ) {
        $response =  (new MorpheusAgent)
            ->continue('2_conversation', as: $user)
            ->prompt(
                $message
            );
    }
}
