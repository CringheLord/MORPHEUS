<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Artifact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use function Pest\Laravel\delete;

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

    public function destroy(Request $request, Task $task, Artifact $artifact)
    {
        abort_unless((int) $artifact->task_id === (int) $task->id, 404);

        if ($artifact->findings()->exists() && ! $request->boolean('force')) {
            return redirect()
                ->route('tasks.inspect', ['task' => $task->id])
                ->withErrors([
                    'artifact' => 'This screenshot has findings linked to it. Confirm deletion to remove the screenshot and its related findings.',
                ]);
        }

        storage::disk('public')->delete($artifact->file_path);
        $artifact->delete();


        return redirect()
            ->route('tasks.inspect', ['task' => $task->id])
            ->with('success', 'Artifact deleted successfully.');
    }
}
