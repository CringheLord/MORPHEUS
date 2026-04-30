<?php

namespace App\Models\Services;

use OpenAI;
use App\Models\Task;
use App\Models\Finding;
use App\Models\EvaluationPattern;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class MorpheusAiService
{
    protected $client;

    public function __construct()
    {
        $this->client = OpenAI::client(env('OPENAI_API_KEY'));
    }

    public function analyzeTaskSequence(Task $task, array $selectedHeuristicIds)
    {
        set_time_limit(600);

        // FORZIAMO L'ID A STRINGA PER LA CACHE E MONGODB
        $taskIdStr = (string)$task->_id;
        $projectIdStr = (string)$task->project_id;

        Log::info("🚀 [MORPHEUS-AI] INIZIO Analisi per Task ID: {$taskIdStr}");
        Log::info("📋 [MORPHEUS-AI] Euristiche selezionate: " . implode(', ', $selectedHeuristicIds));

        // CANCELLA I VECCHI FINDING PRIMA DI INIZIARE
        Finding::where('task_id', $taskIdStr)->delete();

        if (empty($selectedHeuristicIds)) {
            Log::error("❌ [MORPHEUS-AI] Analisi interrotta: nessun ID euristica fornito.");
            return;
        }

        $heuristics = EvaluationPattern::whereIn('h_id', $selectedHeuristicIds)->get();
        $totalHeuristics = count($heuristics);

        if ($heuristics->isEmpty()) {
            Log::error("❌ [MORPHEUS-AI] Analisi interrotta: nessuna euristica trovata nel database.");
            return;
        }

        // SCRITTURA INIZIALE NELLA CACHE
        $initCache = [
            'current' => 0,
            'total' => $totalHeuristics,
            'message' => 'Preparazione immagini e contesto...'
        ];
        Cache::put("task_{$taskIdStr}_progress", $initCache, 600);

        $artifacts = $task->artifacts()->orderBy('created_at', 'asc')->get();
        $imageMessages = [];

        foreach ($artifacts as $idx => $artifact) {
            $relativePath = str_replace(asset('storage/'), '', $artifact->image_url);
            $fullPath = storage_path('app/public/' . $relativePath);

            if (file_exists($fullPath)) {
                $base64 = base64_encode(file_get_contents($fullPath));
                // Etichettiamo l'immagine per l'AI in modo che possa riferirsi all'ID
                $imageMessages[] = [
                    'type' => 'text',
                    'text' => "RIFERIMENTO_ID_IMMAGINE: " . (string)$artifact->_id
                ];
                $imageMessages[] = [
                    'type' => 'image_url',
                    'image_url' => ['url' => "data:image/jpeg;base64,{$base64}"]
                ];
            }
        }

        if (empty($imageMessages)) {
            Log::error("❌ [MORPHEUS-AI] Analisi interrotta: nessuna immagine valida trovata per il task {$taskIdStr}");
            return;
        }

        foreach ($heuristics as $index => $h) {
            // Aggiornamento progresso
            Cache::put("task_{$taskIdStr}_progress", [
                'current' => $index + 1,
                'total' => $totalHeuristics,
                'message' => "Analisi {$h->h_id}: {$h->title}"
            ], 600);

            Log::info("⏳ [MORPHEUS-AI] Analizzando {$h->h_id} (" . ($index + 1) . "/{$totalHeuristics})");

            $formatValue = function ($value) {
                if (is_array($value)) return implode("\n- ", $value);
                return $value ?? 'N/A';
            };

            $trigger     = $formatValue($h->part_a['trigger'] ?? 'N/A');
            $auditRule   = $formatValue($h->part_b['audit_rule'] ?? 'N/A');
            $orgQuestion = $formatValue($h->part_b['org_question'] ?? 'N/A');

            $systemPrompt = <<<EOT
Sei MORPHEUS, un Auditor Senior esperto in UX/UI e Socio-Technical Security.
Analizza TUTTI gli step di interazione forniti (immagini in sequenza cronologica).

ATTENZIONE AL FORMATO DELLE IMMAGINI (SCRIBE):
Le immagini che stai analizzando sono intere pagine PDF renderizzate, generate dal tool "Scribe".
Ogni immagine contiene del "rumore" che DEVI IGNORARE: testo di intestazione, istruzioni scritte in alto o in basso (es. "Click the..."), watermark ("Made with Scribe") e numeri di pagina.
DEVI CONCENTRARTI ESCLUSIVAMENTE sullo screenshot dell'interfaccia utente (UI) incorporato al centro della pagina.
L'elemento su cui l'utente sta interagendo è evidenziato da Scribe con un cerchio arancione. Usa quel cerchio per capire il focus dell'azione.

--- CONTESTO UTENTE ---
1. PERSONA: {$task->user_persona}
2. OBIETTIVO: {$task->user_intent}
3. STRESS: {$task->stress_level}/10 (Costo Errore: {$task->cost_of_error})

--- EURISTICA SOTTO ESAME ---
[ID]: {$h->h_id} - {$h->title}
[TRIGGER/REGOLA]: {$auditRule}
[DETTAGLIO]: {$trigger}

--- ISTRUZIONI OUTPUT E CONSAPEVOLEZZA TEMPORALE ---
1. ANALISI SINGOLA: Cerca la violazione in OGNI singola immagine, analizzando SOLO la porzione di schermo contenente l'interfaccia.
2. ANALISI DI FLUSSO (MULTI-STEP): Valuta l'intero "viaggio" dell'utente. Se noti un problema di interazione distribuito su più pagine (es. un processo inutile, perdita di contesto tra due step), DEVI segnalarlo.

DOVE POSIZIONARE IL BOX ROSSO?
Le coordinate (x, y, width, height) in percentuale devono essere calcolate sull'INTERA IMMAGINE (l'intero foglio PDF), in modo che il box si posizioni correttamente sull'elemento sbagliato della UI.
Se l'errore è un "ERRORE DI FLUSSO", fai un box rosso grande (es. width 80, height 80) sull'immagine del climax finale.

Restituisci questo ESATTO JSON:
{
  "violation_found": true,
  "findings": [
    {
      "artifact_id": "INSERISCI_SOLO_LA_STRINGA_ID_PULITA (Es: 69c3...)",
      "visual_element_description": "Cosa c'è di sbagliato nella UI o nel flusso...",
      "internal_reasoning": "Spiegazione tecnica della violazione...",
      ""pragmatic_explanation": "Fornisci un Executive Summary spietatamente pragmatico (max 3 frasi) per il team tecnico. Non usare elenchi puntati. Segui rigorosamente questa struttura: 1) IL BUG: cosa c'è di sbagliato nell'interfaccia. 2) L'IMPATTO: quale blocco o frustrazione causa all'utente. 3) LA SOLUZIONE: l'azione tecnica o di design esatta per risolverlo. Esempio di tono e lunghezza: 'Il bottone X non ha uno stato attivo. L'utente, non ricevendo feedback visivo, rischia di cliccare due volte inviando dati doppi. Aggiungi uno spinner di caricamento e disabilita il tasto dopo il primo click.'",
      "x": 50, "y": 50, "width": 10, "height": 5,
      "executive_question": "{$orgQuestion}"
    }
  ]
}
Se non trovi NESSUNA violazione, imposta violation_found: false e findings: [].
EOT;

            try {
                $response = $this->client->chat()->create([
                    'model' => 'gpt-4o',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $imageMessages]
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.0
                ]);

                $result = json_decode($response->choices[0]->message->content, true);

                if (isset($result['violation_found']) && $result['violation_found'] === true && !empty($result['findings'])) {

                    foreach ($result['findings'] as $findingData) {
                        // PULIZIA AGGRESSIVA ID (Rimuove prefissi e spazi)
                        $rawArtId = $findingData['artifact_id'] ?? '';
                        $cleanArtId = trim(str_replace(['RIFERIMENTO_ID_IMMAGINE:', 'ID_IMMAGINE:', 'ID:', 'Step'], '', $rawArtId));

                        Finding::create([
                            'project_id'  => $projectIdStr,
                            'task_id'     => $taskIdStr,
                            'artifact_id' => $cleanArtId,
                            'heuristic_id'=> $h->h_id,
                            'coordinates' => [
                                'x' => $findingData['x'] ?? 50,
                                'y' => $findingData['y'] ?? 50,
                                'width' => $findingData['width'] ?? 20, // Default leggermente più grande
                                'height' => $findingData['height'] ?? 20
                            ],
                            'internal_reasoning' => $findingData['internal_reasoning'] ?? 'N/A',
                            'pragmatic_explanation' => $findingData['pragmatic_explanation'] ?? 'N/A', // <--- AGGIUNTO
                            'visual_element_description' => $findingData['visual_element_description'] ?? 'N/A',
                            'status' => 'pending'
                        ]);
                        Log::info("🚨 [MORPHEUS-AI] Salvato finding per {$h->h_id} su artefatto {$cleanArtId}");
                    }
                }
            } catch (\Exception $e) {
                Log::error("❌ [MORPHEUS-AI] Errore API per {$h->h_id}: " . $e->getMessage());
            }
        }

        $task->update(['status' => 'completed']);
        Cache::forget("task_{$taskIdStr}_progress");
        Log::info("🏁 [MORPHEUS-AI] Analisi completata.");
    }
}
