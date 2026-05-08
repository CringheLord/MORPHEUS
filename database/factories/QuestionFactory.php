<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        $types = ['yes_no', 'likert', 'free_text'];

        $categories = [
            'Training',
            'Procedures',
            'Communication',
            'Resources',
            'Security Culture',
            'Workload',
        ];

        $humanFactors = [
            'Lack of training',
            'Time pressure',
            'Lack of resources',
            'Lack of communication',
            'Lack of knowledge',
            'Cognitive fatigue',
            'Stress',
            'Security self-efficacy',
            'Attitude towards policies',
            'Norms',
        ];

        return [
            'title' => fake()->sentence(4),
            'question' => fake()->sentence(12),
            'type' => fake()->randomElement($types),
            'category' => fake()->randomElement($categories),
            'human_factor' => fake()->randomElement($humanFactors),
        ];
    }
}
