<?php

namespace Database\Seeders;

use App\Models\Questionnaire;
use App\Models\StudyCase;
use Illuminate\Database\Seeder;


class QuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $studyCases = StudyCase::query()
            ->with(['owner', 'users'])
            ->get();

        foreach ($studyCases as $studyCase) {
            $members = $studyCase->users;

            if ($studyCase->owner) {
                $members = $members
                    ->push($studyCase->owner)
                    ->unique('id')
                    ->values();
            }

            if ($members->isEmpty()) {
                continue;
            }

            Questionnaire::factory()
                ->count(fake()->numberBetween(2, 4))
                ->state(fn () => [
                    'study_case_id' => $studyCase->id,
                    'created_by_id' => $members->random()->id,
                ])
                ->create();
        }
    }
}
