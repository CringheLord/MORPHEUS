<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Artifact;
use Illuminate\Http\Request;

class ArtifactController extends Controller
{
    public function store( Request $request, $taskId) {

        $request->validate(
            ['images' => ['required', 'array']],
            ['images.*' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp'],]
        );

        $task = Task::findOrFail($taskId);

        $path = "storage/artifacts/";
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('artifacts', 'public');
                Artifact::create([
                    'task_id' => $task->id,
                    'image_url' => asset('storage/' . $path),
                    'file_path' => $path,
                ]);
            }
        }
        return back()->with('success', 'Artifacts uploaded successfully.');
    }
}
