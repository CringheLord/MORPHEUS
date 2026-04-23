<?php

namespace Database\Factories;

use App\Models\StudyCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<StudyCase>
 */
class StudyCaseFactory extends Factory
{
    protected $model = StudyCase::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['draft', 'in_progress', 'completed', 'archived']);
        $title = fake()->unique()->sentence(3);

        $startedAt = fake()->optional(0.7)->dateTimeBetween('-30 days', '-1 day');
        $completedAt = $status === 'completed'
            ? fake()->dateTimeBetween('-10 days', 'now')
            : null;

        return [
            'owner_id' => User::factory(),

            'title' => $title,
            //'slug' => Str::slug($title) . '-' . Str::lower(Str::random(6)),
            'description' => fake()->paragraph(),

            'system_name' => fake()->randomElement([
                'HR Portal',
                'Banking Dashboard',
                'E-commerce Checkout',
                'Telemedicine Triage',
                'Admin Backoffice',
                'Customer Support Console',
            ]),

            'system_type' => fake()->randomElement([
                'web app',
                'dashboard',
                'e-commerce',
                'internal portal',
                'mobile web',
            ]),

            'target_url' => fake()->optional()->url(),
            'analysis_goal' => fake()->sentence(),

            'status' => $status,
            'risk_score' => $status === 'completed'
                ? fake()->randomFloat(2, 0.50, 5.00)
                : 0,

            'c_percentage' => match ($status) {
                'draft' => fake()->numberBetween(0, 15),
                'in_progress' => fake()->numberBetween(10, 90),
                'completed' => 100,
                'archived' => fake()->numberBetween(0, 100),
            },

            'current_layer' => fake()->randomElement([
                'interface',
                'cognitive',
                'organizational',
                'review',
                null,
            ]),

            'current_step' => fake()->randomElement([
                'discovery',
                'heuristic-selection',
                'violation-mapping',
                'reporting',
                null,
            ]),

            'started_at' => $startedAt,
            'completed_at' => $completedAt,
            'last_opened_at' => fake()->optional(0.8)->dateTimeBetween('-7 days', 'now'),
            'last_opened_section' => fake()->randomElement([
                'overview',
                'heuristics',
                'violations',
                'report',
                null,
            ]),

            'meta' => [
                'tags' => fake()->randomElements([
                    'Cognitive Load',
                    'Trust',
                    'Stress',
                    'Decision Friction',
                    'Action Perception',
                ], fake()->numberBetween(1, 3)),
            ],
            'risk_level' => fake()->randomElement(['low', 'medium', 'high']),
        ];
    }
}
