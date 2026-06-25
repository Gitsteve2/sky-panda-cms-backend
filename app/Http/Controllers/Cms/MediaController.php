<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(Request $request): Response|JsonResponse
    {
        $query = Media::latest();

        if ($request->collection) {
            $query->where('collection', $request->collection);
        }

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->wantsJson() || $request->header('X-Media-Picker')) {
            $perPage = min((int) $request->input('per_page', 100), 200);
            return response()->json(['data' => $query->paginate($perPage)]);
        }

        return Inertia::render('cms/media/index', [
            'media' => $query->paginate(24),
            'collection' => $request->collection ?? 'all',
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB
            'collection' => 'nullable|string|max:50',
            'alt_text' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $collection = $request->input('collection', 'general');
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("media/{$collection}", $fileName, 'public');

        $media = Media::create([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'file_name' => $fileName,
            'mime_type' => $file->getMimeType(),
            'path' => $path,
            'url' => Storage::url($path),
            'size' => $file->getSize(),
            'disk' => 'public',
            'alt_text' => $request->alt_text,
            'collection' => $collection,
            'uploaded_by' => auth()->id(),
        ]);

        return response()->json($media);
    }

    public function update(Request $request, Media $medium): RedirectResponse
    {
        $data = $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'name' => 'nullable|string|max:255',
        ]);

        $medium->update($data);

        return back()->with('success', 'Media updated.');
    }

    public function destroy(Media $medium): RedirectResponse
    {
        Storage::disk($medium->disk)->delete($medium->path);
        $medium->delete();

        return back()->with('success', 'Media deleted.');
    }
}
