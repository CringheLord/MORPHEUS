<?php

namespace Database\Seeders;

use App\Models\StudyCase;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AppSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::firstOrCreate(
            ['email' => 'pi@example.com', ],
            ['name' => 'Super Admin', 'password' => Hash::make('password')],
        );

        // Main study cases owned by first user
        $studyCases = StudyCase::factory()
            ->count(12)
            ->for($owner, 'owner')
            ->create();

        // Optional collaborator users
        $collaborators = User::factory()->count(3)->create();

        // Attach random collaborators to some study cases
        foreach ($studyCases as $studyCase) {
            $studyCase->users()->attach(
                $collaborators->random(rand(0, 2))->pluck('id')->all()
            );
        }
    }
}
