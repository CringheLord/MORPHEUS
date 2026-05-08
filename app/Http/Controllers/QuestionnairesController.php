<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Questionnaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestionnairesController extends Controller
{
    public function store($studyCaseId)
    {

        $questionnaire = new Questionnaire();

        $questionnaire->study_case_id = $studyCaseId;
        $questionnaire->created_by_id = Auth::id();

        $questionnaire->save();

        return redirect()->route('study-cases.questionnaires.show', ['studyCase' => $studyCaseId, 'questionnaire' => $questionnaire->id]);
    }

    public function show($studyCaseId, $questionnaireId)
    {
        $questionnaire = Questionnaire::findOrFail($questionnaireId);
        $questionnaire->load('questions');
        $studyCase = $questionnaire->studyCase;

        $questions = Question::all();

        return Inertia::render('audits/QuestionnairesCreate', [
            'questionnaire' => $questionnaire,
            'studyCase' => $studyCase,
            'questions' => $questions,
        ]);
    }

    public function update($studyCaseId, $questionnaireId, Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['string'],
            'status' => ['required', 'in:draft,active,closed'],

            'questions' => ['array'],
            'questions.*.id' => ['required', 'integer', 'exists:questions,id'],
            'questions.*.position' => ['required', 'integer', 'min:1'],
        ]);

        $questionnaire = Questionnaire::findOrFail($questionnaireId);
        $questionnaire->update([
           'title' => $validated['title'],
           'description' => $validated['description'],
           'status' => $validated['status'],
        ]);


        $questionsToSync = collect($validated['questions'] ?? [])
            ->sortBy('position')
            ->values()
            ->mapWithKeys(function ( $question, $index ) {
                return [
                    $question['id'] => [
                        'position' => $index + 1,
                    ],
                ];
            })
            ->all();
        $questionnaire->questions()->sync($questionsToSync);

        $questionnaire->save();

        return back();
    }

    public function getSubmit($questionnaireId)
    {
        $questionnaire = Questionnaire::findOrFail($questionnaireId);
        $questionnaire->load('questions');

        return Inertia::render('guest/QuestionnaireSubmit', [
            'questionnaire' => $questionnaire,
        ]);
    }

    public function submit($questionnaireId, Request $request) {

    }
}
