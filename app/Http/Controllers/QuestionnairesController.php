<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Questionnaire;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            //'status' => ['required', 'in:draft,active,closed'],

            'questions' => ['array'],
            'questions.*.id' => ['required', 'integer', 'exists:questions,id'],
            'questions.*.position' => ['required', 'integer', 'min:1'],
        ]);

        $questionnaire = Questionnaire::findOrFail($questionnaireId);
        $questionnaire->update([
           'title' => $validated['title'],
           'description' => $validated['description'],
           //'status' => $validated['status'],
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
        $questions = $questionnaire->questions;

        return Inertia::render('guest/QuestionnaireSubmit', [
            'questionnaire' => $questionnaire,
            'questions' => $questions,
        ]);
    }

    public function submit($questionnaireId, Request $request) {

        $questionnaire = Questionnaire::findOrFail($questionnaireId);

        $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.value' => ['required'],
        ]);


        DB::transaction(function () use ($request, $questionnaire) {
            $submission = new Submission([
                    'questionnaire_id' => $questionnaire->id,
                ]
            );
            $submission->save();

            foreach ($request->answers as $answer) {
                $question = Question::firstWhere('id', $answer['question_id']);
                $value = $answer['value'];

                if ($question->type === "likert"){
                    $newAnswer = new Answer([
                            'question_id' => $answer['question_id'],
                            'submission_id' => $submission->id,
                            'score' => $value,
                        ]
                    );
                }else if ($question->type === "yes_no") {
                    $newAnswer = new Answer([
                            'question_id' => $answer['question_id'],
                            'submission_id' => $submission->id,
                            'answer' => $value,
                        ]
                    );
                }else {
                    $newAnswer = new Answer([
                            'question_id' => $answer['question_id'],
                            'submission_id' => $submission->id,
                            'text' => $value,
                        ]
                    );
                }
                $newAnswer->save();
            }
        });

        return redirect()->back()->with('success', 'Questionnaire submitted successfully.' );


    }

    public function share($questionnaireId, Request $request)
    {
        $questionnaire = Questionnaire::findOrFail($questionnaireId);

        $questionnaire->link = $request['url'];
        $questionnaire->status = "active";
        $questionnaire->shared = true;

        $questionnaire->save();

        return redirect()->back();
    }

    public function results($questionnaireId)
    {
        $questionnaire = Questionnaire::findOrFail($questionnaireId);
        $questionnaire->load('submissions.answers');

        return Inertia::render('study-cases/QuestionnaireResult'
        );
    }
}
