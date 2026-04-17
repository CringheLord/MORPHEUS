<?php

namespace Database\Seeders;

use App\Models\Heuristic;
use App\Models\HumanFactor;
use App\Models\UiTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class HeuristicsImportSeeder extends Seeder
{
    public function run(): void
    {
        $path = storage_path('app/private/database_euristiche_master_normalized_v2.json');

        if (! File::exists($path)) {
            throw new \RuntimeException("JSON file not found at: {$path}");
        }

        $json = File::get($path);
        $records = json_decode($json, true);

        if (! is_array($records)) {
            throw new \RuntimeException('Invalid JSON structure: expected an array of heuristics.');
        }

        DB::transaction(function () use ($records) {
            foreach ($records as $item) {
                // Human Factors
                $humanFactors = HumanFactor::updateOrCreate(
                    [
                        'name' => $item['human_factor'],
                    ],
                    [
                        'category' =>$item['category'],
                        'icon' =>$item['icon'],
                    ]
                );

                // Heuristics
                $heuristic = Heuristic::updateOrCreate(
                    [
                        'h_id' => $item['h_id'],
                    ],
                    [
                        'title' => $item['title'],
                        'human_factor_id' => $humanFactors->id,  //relation with human factors
                        //part_a
                        'trigger' => $item['part_a']['trigger'] ?? null,
                        'examples' => $item['part_a']['examples'] ?? null,
                        'human_factor_exp' => $item['part_a']['human_factor_exp'] ?? null,
                        'error' => $item['part_a']['error'] ?? null,
                        'mitigation' => $item['part_a']['mitigation'] ?? null,
                        //part_b
                        'audit_rule' => $item['part_b']['audit_rule'] ?? null,
                        'violations' => $item['part_b']['violations'] ?? null,
                        'security_risk' => $item['part_b']['security_risk'] ?? null,
                        'remediation' => $item['part_b']['remediation'] ?? null,
                        'org_question' => $item['part_b']['org_question'] ?? null,
                    ]
                );

                // UI Tags
                $tagIds = [];

                foreach (($item['uiTag'] ?? []) as $tagName) {
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
                $heuristic->uiTags()->sync($tagIds);
            }
        });


    }
}
