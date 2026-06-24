<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PagesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/pages/index', [
            'pages' => Page::withCount('sections')->orderBy('title')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cms/pages/form', ['page' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $page = Page::create($data);

        return redirect()->route('cms.pages.sections', $page)->with('success', 'Page created successfully.');
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('cms/pages/form', ['page' => $page]);
    }

    public function update(Request $request, Page $page): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,' . $page->id,
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $page->update($data);

        return back()->with('success', 'Page updated.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        if ($page->is_system) {
            return back()->with('error', 'System pages cannot be deleted.');
        }

        $page->delete();

        return redirect()->route('cms.pages.index')->with('success', 'Page deleted.');
    }

    public function sections(Page $page): Response
    {
        return Inertia::render('cms/pages/sections', [
            'page' => $page->load('sections'),
            'sectionTypes' => $this->getSectionTypes(),
        ]);
    }

    public function storeSection(Request $request, Page $page): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'section_type' => 'required|string|max:100',
            'content' => 'nullable|array',
            'order' => 'integer',
            'is_active' => 'boolean',
            'background_color' => 'nullable|string',
            'background_image' => 'nullable|string',
            'css_class' => 'nullable|string',
        ]);

        $page->sections()->create($data);

        return back()->with('success', 'Section added.');
    }

    public function updateSection(Request $request, Page $page, PageSection $section): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'section_type' => 'required|string|max:100',
            'content' => 'nullable|array',
            'order' => 'integer',
            'is_active' => 'boolean',
            'background_color' => 'nullable|string',
            'background_image' => 'nullable|string',
            'css_class' => 'nullable|string',
        ]);

        $section->update($data);

        return back()->with('success', 'Section updated.');
    }

    public function reorderSections(Request $request, Page $page): RedirectResponse
    {
        $data = $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|integer',
            'sections.*.order' => 'required|integer',
        ]);

        foreach ($data['sections'] as $item) {
            PageSection::where('id', $item['id'])->where('page_id', $page->id)->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Sections reordered.');
    }

    public function destroySection(Page $page, PageSection $section): RedirectResponse
    {
        $section->delete();

        return back()->with('success', 'Section deleted.');
    }

    private function getSectionTypes(): array
    {
        return [
            ['value' => 'hero', 'label' => 'Hero', 'description' => 'Full-width hero with heading, subheading and CTA'],
            ['value' => 'text', 'label' => 'Text Block', 'description' => 'Simple rich text content'],
            ['value' => 'cards', 'label' => 'Cards Grid', 'description' => 'Grid of icon/image cards'],
            ['value' => 'testimonials', 'label' => 'Testimonials', 'description' => 'Customer testimonials section'],
            ['value' => 'stats', 'label' => 'Statistics', 'description' => 'Key numbers and metrics'],
            ['value' => 'cta', 'label' => 'Call to Action', 'description' => 'Promotional banner with CTA buttons'],
            ['value' => 'image_text', 'label' => 'Image + Text', 'description' => 'Side-by-side image and text'],
            ['value' => 'gallery', 'label' => 'Image Gallery', 'description' => 'Grid of images'],
            ['value' => 'faq', 'label' => 'FAQ Accordion', 'description' => 'Expandable FAQ list'],
            ['value' => 'form', 'label' => 'Contact Form', 'description' => 'Embedded form or contact form'],
            ['value' => 'map', 'label' => 'Map', 'description' => 'Google/embedded map section'],
            ['value' => 'video', 'label' => 'Video', 'description' => 'Embedded video section'],
            ['value' => 'custom', 'label' => 'Custom HTML', 'description' => 'Free-form HTML/embed code'],
        ];
    }
}
