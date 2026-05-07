<?php

namespace App\Http\Controllers;

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

        return Inertia::render('audits/QuestionnairesCreate', [
            'questionnaire' => $questionnaire,
            'studyCase' => $studyCase,
        ]);
    }

    public function update($studyCaseId, $questionnaireId, Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['string'],
            'status' => ['required', 'in:draft,active,closed'],
        ]);

        $questionnaire = Questionnaire::findOrFail($questionnaireId);
        $questionnaire->title = $validated['title'];
        $questionnaire->description = $validated['description'];
        $questionnaire->status = $validated['status'];

        $questionnaire->save();

        return back();
    }
}
