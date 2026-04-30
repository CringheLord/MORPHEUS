<?php

namespace Database\Seeders;

use App\Models\EvaluationPattern;
use App\Models\HumanFactor;
use App\Models\UiTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class EvaluationPatternImportSeeder extends Seeder
{

    public function run(): void
    {
        $human_factors = [
            [
                'name' => 'Cyber risk beliefs',
                'category' => 'Cognitive',
                'icon' => 'shield-alert',
            ],
            [
                'name' => 'Lack of awareness',
                'category' => 'Cognitive',
                'icon' => 'eye-off',
            ],
            [
                'name' => 'Cognitive fatigue',
                'category' => 'Cognitive',
                'icon' => 'battery-low',
            ],
            [
                'name' => 'Vigilance',
                'category' => 'Cognitive',
                'icon' => 'search-check',
            ],
            [
                'name' => 'Cognitive reflectiveness',
                'category' => 'Cognitive',
                'icon' => 'brain',
            ],
            [
                'name' => 'Bias',
                'category' => 'Cognitive',
                'icon' => 'brain-circuit',
            ],
            [
                'name' => 'Lack of knowledge',
                'category' => 'Cognitive',
                'icon' => 'graduation-cap',
            ],
            [   'name' => 'Overconfidence',
                'category' => 'Cognitive',
                'icon' => 'badge-check',
            ],
            [
                'name' => 'Misperception',
                'category' => 'Cognitive',
                'icon' => 'eye',],
            [
                'name' => 'Uncertainty',
                'category' => 'Cognitive',
                'icon' => 'circle-question-mark',
            ],
            [
                'name' => 'Complacency',
                'category' => 'Behavioral',
                'icon' => 'badge-check',
            ],
            [
                'name' => 'Compulsive behavior',
                'category' => 'Behavioral',
                'icon' => 'mouse-pointer-click',
            ],
            [
                'name' => 'Frustration',
                'category' => 'Emotional',
                'icon' => 'frown',
            ],
            [
                'name' => 'Stress',
                'category' => 'Emotional',
                'icon' => 'zap',
            ],
            [
                'name' => 'Shame',
                'category' => 'Emotional',
                'icon' => 'user-round-x',
            ],
            [
                'name' => 'Fear',
                'category' => 'Emotional',
                'icon' => 'triangle-alert',
            ],
        ];


        $path = database_path('data/New_Heuristics.json');

        if (! File::exists($path)) {
            throw new \RuntimeException("JSON file not found at: {$path}");
        }

        $json = File::get($path);
        $records = json_decode($json, true);

        if (! is_array($records)) {
            throw new \RuntimeException('Invalid JSON structure: expected an array of evaluationPatterns.');
        }

        DB::transaction(function () use ($human_factors, $records) {

            foreach ($records as $item) {
                foreach ($human_factors as $factor) {
                    // Human Factors
                    $humanFactors = HumanFactor::updateOrCreate(
                        [
                            'name' => $factor['name'],
                        ],
                        [
                            'category' =>$factor['category'],
                            'icon' =>$factor['icon'],
                        ]
                    );
                }
                // Human Factors
                $humanFactor = HumanFactor::updateOrCreate(
                    [
                        'name' => $item['human_factor'],
                    ],
                    [
                        'category' =>$item['category'],
                    ]
                );

                // EvaluationPattern
                $evaluationPattern = EvaluationPattern::updateOrCreate(
                    [
                        'h_id' => $item['h_id'],
                    ],
                    [
                        'title' => $item['title'],
                        'icon' =>$item['icon'],
                        'human_factor_id' => $humanFactor->id,  //relation with human factors
                        //part_a
                        'trigger' => $item['part_a']['trigger'] ?? null,
                        'examples' => $item['part_a']['examples'] ?? null,
                        'human_factor_exp' => $item['part_a']['human_factor_exp'] ?? null,
                        'error' => $item['part_a']['error'] ?? null,
                        'mitigation' => $item['part_a']['mitigation'] ?? null,
                        'criticality_context' => $item['part_a']['criticality_context'] ?? null,
                        'evidence' => $item['part_a']['evidence'] ?? null,
                        //part_b
                        'audit_rule' => $item['part_b']['audit_rule'] ?? null,
                        'violations' => $item['part_b']['violations'] ?? null,
                        'security_risk' => $item['part_b']['security_risk'] ?? null,
                        'remediation' => $item['part_b']['remediation'] ?? null,
                        'org_question' => $item['part_b']['org_question'] ?? null,
                        'reference' => $item['part_b']['reference'] ?? null,
                    ]
                );

                // UI Tags
                $tagIds = [];

                foreach (($item['ui_tags'] ?? []) as $tagName) {
                    $cleanName = trim($tagName);

                    $tag = UiTag::updateOrCreate(
                        [
                            'name' => $cleanName,
                        ],
                        [
                            'slug' => Str::slug(
                                preg_replace('/[^\p{L}\p{N}\s\-\/&]+/u', '', $cleanName)
                            ),
                        ]
                    );
                    $tagIds[] = $tag->id;
                }

                // Sync pivot
                $evaluationPattern->uiTags()->sync($tagIds);
            }
        });


    }
}
