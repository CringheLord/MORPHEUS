<?php

namespace Database\Factories;

use App\Models\Questionnaire;
use App\Models\StudyCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Questionnaire>
 */
class QuestionnaireFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['draft', 'active', 'closed']);

        return [
            'title' => fake()->sentence(4),
            'description' => fake()->text(40),

            'study_case_id' => StudyCase::factory(),
            'created_by_id' => User::factory(),

            'status' => $status,

            'link' => $status === 'active'
                ? '/questionnaires/share/'. Str::uuid()
                : null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => 'draft',
            'link' => null,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status' => 'active',
            'link' => '/questionnaires/share/' . Str::uuid(),
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn () => [
            'status' => 'closed',
            'link' => null,
        ]);
    }
}
