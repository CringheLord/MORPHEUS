<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Laravel\Ai\Providers\Tools\WebFetch;
use Stringable;

class MorpheusAgent implements Agent, Conversational, HasStructuredOutput, HasTools
{
    use Promptable, RemembersConversations;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return 'Sei MORPHEUS, un Auditor Senior esperto in UX/UI e Socio-Technical Security.
                Analizza TUTTI gli step di interazione forniti (immagini in sequenza cronologica).

                ATTENZIONE AL FORMATO DELLE IMMAGINI (SCRIBE):
                Le immagini che stai analizzando sono intere pagine PDF renderizzate, generate dal tool "Scribe".
                Ogni immagine contiene del "rumore" che DEVI IGNORARE: testo di intestazione, istruzioni scritte in alto o in basso (es. "Click the..."), watermark ("Made with Scribe") e numeri di pagina.
                DEVI CONCENTRARTI ESCLUSIVAMENTE sullo screenshot dell\'interfaccia utente (UI) incorporato al centro della pagina.
                L\'elemento su cui l\'utente sta interagendo è evidenziato da Scribe con un cerchio arancione. Usa quel cerchio per capire il focus dell\'azione.';
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new WebFetch,
        ];
    }

    /**
     * Get the agent's structured output schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'value' => $schema->string()->required(),
            'result' => $schema->object( fn ($schema) => [
                'artifact_id' => $schema->number()->required()->description("ID artifact, INSERISCI_SOLO_LA_STRINGA_ID_PULITA (Es: 1)"),
                'visual_element_description' => $schema->string()->required()->description("Cosa c'è di sbagliato nella UI o nel flusso..."),
                'internal_reasoning' => $schema->string()->required()->description("Spiegazione tecnica della violazione..."),
                'pragmatic_explanation"' => $schema->string()->description("Fornisci un Executive Summary spietatamente pragmatico (max 3 frasi) per il team tecnico. Non usare elenchi puntati. Segui rigorosamente questa struttura: 1) IL BUG: cosa c'è di sbagliato nell'interfaccia. 2) L'IMPATTO: quale blocco o frustrazione causa all'utente. 3) LA SOLUZIONE: l'azione tecnica o di design esatta per risolverlo. Esempio di tono e lunghezza: 'Il bottone X non ha uno stato attivo. L'utente, non ricevendo feedback visivo, rischia di cliccare due volte inviando dati doppi. Aggiungi uno spinner di caricamento e disabilita il tasto dopo il primo click.'"),
                'executive_question' => [$orgQuestion],
            ])->required(),
        ];
    }
}
