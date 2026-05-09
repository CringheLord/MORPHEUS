<?php

namespace App\Http\Middleware;

use App\Models\Questionnaire;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SharedQuestionnaire
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $questionnaireId = $request->route('questionnaires');
        $questionnaire = Questionnaire::find($questionnaireId);


        if (! $questionnaire || ! $questionnaire->shared) {
            abort(404, 'Questionnaire not found');
        }

        return $next($request);

    }
}
