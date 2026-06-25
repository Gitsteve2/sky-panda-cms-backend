<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\ProjectUpdate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectUpdatesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/project-updates/index', [
            'updates' => ProjectUpdate::orderByDesc('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'month'            => 'required|string|max:100',
            'location'         => 'nullable|string|max:255',
            'image'            => 'nullable|string',
            'status'           => 'required|string|max:100',
            'highlight'        => 'required|string',
            'description'      => 'nullable|string',
            'highlights'       => 'nullable|array',
            'highlights.*'     => 'string',
            'is_current_phase' => 'boolean',
            'order'            => 'integer',
            'is_active'        => 'boolean',
        ]);

        ProjectUpdate::create($data);

        return back()->with('success', 'Project update added.');
    }

    public function update(Request $request, ProjectUpdate $projectUpdate): RedirectResponse
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'month'            => 'required|string|max:100',
            'location'         => 'nullable|string|max:255',
            'image'            => 'nullable|string',
            'status'           => 'required|string|max:100',
            'highlight'        => 'required|string',
            'description'      => 'nullable|string',
            'highlights'       => 'nullable|array',
            'highlights.*'     => 'string',
            'is_current_phase' => 'boolean',
            'order'            => 'integer',
            'is_active'        => 'boolean',
        ]);

        $projectUpdate->update($data);

        return back()->with('success', 'Project update saved.');
    }

    public function destroy(ProjectUpdate $projectUpdate): RedirectResponse
    {
        $projectUpdate->delete();

        return back()->with('success', 'Project update deleted.');
    }
}
