<?php

use App\Ai\Agents\MorpheusAgent;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use function Laravel\Prompts\text;

Artisan::command('testChat', function () {
    $user = User::query()->first();

    while (true) {
        $prompt = text('Prompt:');

        $response =  MorpheusAgent::make()
            ->continue('2_conversation', as: $user)
            ->prompt(
                $prompt,
                provider: 'gemini',
            );
        $this->info($response);
    }

});
