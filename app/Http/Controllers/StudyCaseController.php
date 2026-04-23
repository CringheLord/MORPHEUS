<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\StudyCase;

class StudyCaseController extends Controller
{
    public function index()
    {
        $studyCases = StudyCase::with('owner', 'users')
            ->where(function ($query) {
                $query->where('owner_id', Auth::id())
                    ->orWhereHas('users', function ($q) {
                        $q->where('users.id', Auth::id());
                    });
            })
            ->latest()
            ->paginate(3);

        $AvgSC = StudyCase::where(function ($query) {
            $query->where('owner_id', Auth::id())
                ->orWhereHas('users', function ($q) {
                    $q->where('users.id', Auth::id());
                });
        })
            ->avg('risk_score');

        $totalSC = StudyCase::where(function ($query) {
            $query->where('owner_id', Auth::id())
                ->orWhereHas('users', function ($q) {
                    $q->where('users.id', Auth::id());
                });
        })
            ->count();

        return Inertia::render('study-cases/Index', [
            'StudyCases' => $studyCases,
            'totalSC' => $totalSC,
            'AvgSC' => $AvgSC,
        ]);
    }

    public function create()
    {
        $studyCase = new StudyCase();
        $studyCase->owner_id = Auth::id();
        $studyCase->title = 'insert your title here';
        $studyCase->system_name = 'insert your system name here';
        $studyCase->system_type = 'insert your system type here';
        $studyCase->save();
        return Inertia::render('study-cases/Show', ['studyCase' => $studyCase]);
    }

    public function show(StudyCase $studyCase)
    {
        $studyCase->load(['owner', 'lastUser', 'assignedUser', 'users']);

        return Inertia::render('study-cases/Show', [
            'studyCase' => $studyCase,
            'relatedUsers' => $studyCase->users,
        ]);
    }

    public function update(Request $request, StudyCase $studyCase)
    {
        $this->authorizeStudyCaseAccess($studyCase);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'in:draft,in_progress,completed,archived'],
            'assigned_user_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'system_name' => ['sometimes', 'required', 'string', 'max:255'],
            'system_type' => ['sometimes', 'nullable', 'string', 'max:255'],
            'current_layer' => ['sometimes', 'nullable', 'in:interface,cognitive,organizational,review'],
        ]);

        if (
            array_key_exists('assigned_user_id', $validated)
            && ! is_null($validated['assigned_user_id'])
            && ! $studyCase->users()->where('users.id', $validated['assigned_user_id'])->exists()
        ) {
            return back()->withErrors([
                'assigned_user_id' => 'The selected user is not related to this Study Case.',
            ]);
        }

        $studyCase->update($validated);

        $studyCase->last_user_id = Auth::id();
        $studyCase->save();

        return back();
    }

    protected function authorizeStudyCaseAccess(StudyCase $studyCase): void
    {
        $userId = Auth::id();

        $allowed = $studyCase->owner_id === $userId  // si potrebeb anche cambiare in futuro per permettere modifica solo a owner o a assigned_user
            || $studyCase->users()->where('users.id', $userId)->exists();

        abort_unless($allowed, 403);
    }

   /* public function update(StudyCase $studyCase)
    {
        return Inertia::render('study-cases/', [
        ]);
    }*/
}
