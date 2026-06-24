<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\CoreValue;
use App\Models\HeroSlide;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\Stat;
use App\Models\TrackRecord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/settings/index', [
            'settings' => SiteSetting::orderBy('group')->orderBy('key')->get()->groupBy('group'),
            'heroSlides' => HeroSlide::orderBy('order')->get(),
            'socialLinks' => SocialLink::orderBy('order')->get(),
            'stats' => Stat::orderBy('group')->orderBy('order')->get()->groupBy('group'),
            'coreValues' => CoreValue::orderBy('order')->get(),
            'trackRecords' => TrackRecord::orderBy('order')->get(),
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($data['settings'] as $item) {
            SiteSetting::set($item['key'], $item['value'] ?? '');
        }

        return back()->with('success', 'Settings saved.');
    }

    // Hero slides
    public function storeHero(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'badge_text' => 'nullable|string|max:255',
            'heading' => 'required|string|max:500',
            'heading_highlight' => 'nullable|string|max:255',
            'subheading' => 'nullable|string',
            'cta_text' => 'nullable|string|max:255',
            'cta_url' => 'nullable|string|max:500',
            'cta_target' => 'in:_self,_blank',
            'secondary_cta_text' => 'nullable|string|max:255',
            'secondary_cta_url' => 'nullable|string|max:500',
            'background_type' => 'in:video,image,color',
            'background_src' => 'nullable|string|max:500',
            'background_poster' => 'nullable|string|max:500',
            'overlay_color' => 'nullable|string|max:50',
            'order' => 'integer',
        ]);

        HeroSlide::create($data);

        return back()->with('success', 'Hero slide added.');
    }

    public function updateHero(Request $request, HeroSlide $heroSlide): RedirectResponse
    {
        $data = $request->validate([
            'badge_text' => 'nullable|string|max:255',
            'heading' => 'required|string|max:500',
            'heading_highlight' => 'nullable|string|max:255',
            'subheading' => 'nullable|string',
            'cta_text' => 'nullable|string|max:255',
            'cta_url' => 'nullable|string|max:500',
            'cta_target' => 'in:_self,_blank',
            'secondary_cta_text' => 'nullable|string|max:255',
            'secondary_cta_url' => 'nullable|string|max:500',
            'background_type' => 'in:video,image,color',
            'background_src' => 'nullable|string|max:500',
            'background_poster' => 'nullable|string|max:500',
            'overlay_color' => 'nullable|string|max:50',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $heroSlide->update($data);

        return back()->with('success', 'Hero slide updated.');
    }

    public function destroyHero(HeroSlide $heroSlide): RedirectResponse
    {
        $heroSlide->delete();

        return back()->with('success', 'Hero slide deleted.');
    }

    // Social links
    public function storeSocial(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'platform' => 'required|string|max:50',
            'label' => 'required|string|max:100',
            'url' => 'required|string|max:500',
            'icon' => 'nullable|string|max:50',
            'order' => 'integer',
        ]);

        SocialLink::create($data);

        return back()->with('success', 'Social link added.');
    }

    public function updateSocial(Request $request, SocialLink $socialLink): RedirectResponse
    {
        $data = $request->validate([
            'platform' => 'required|string|max:50',
            'label' => 'required|string|max:100',
            'url' => 'required|string|max:500',
            'icon' => 'nullable|string|max:50',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $socialLink->update($data);

        return back()->with('success', 'Social link updated.');
    }

    public function destroySocial(SocialLink $socialLink): RedirectResponse
    {
        $socialLink->delete();

        return back()->with('success', 'Social link deleted.');
    }

    // Stats
    public function storeStat(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'group' => 'required|string|max:50',
            'icon' => 'nullable|string|max:50',
            'value' => 'required|string|max:100',
            'label' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'integer',
        ]);

        Stat::create($data);

        return back()->with('success', 'Stat added.');
    }

    public function updateStat(Request $request, Stat $stat): RedirectResponse
    {
        $data = $request->validate([
            'group' => 'required|string|max:50',
            'icon' => 'nullable|string|max:50',
            'value' => 'required|string|max:100',
            'label' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $stat->update($data);

        return back()->with('success', 'Stat updated.');
    }

    public function destroyStat(Stat $stat): RedirectResponse
    {
        $stat->delete();

        return back()->with('success', 'Stat deleted.');
    }

    // Core Values
    public function storeCoreValue(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:50',
            'icon_color' => 'nullable|string|max:20',
            'order' => 'integer',
        ]);

        CoreValue::create($data);

        return back()->with('success', 'Core value added.');
    }

    public function updateCoreValue(Request $request, CoreValue $coreValue): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:50',
            'icon_color' => 'nullable|string|max:20',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $coreValue->update($data);

        return back()->with('success', 'Core value updated.');
    }

    public function destroyCoreValue(CoreValue $coreValue): RedirectResponse
    {
        $coreValue->delete();

        return back()->with('success', 'Core value deleted.');
    }

    // Track Records
    public function storeTrackRecord(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'order' => 'integer',
        ]);

        TrackRecord::create($data);

        return back()->with('success', 'Track record added.');
    }

    public function updateTrackRecord(Request $request, TrackRecord $trackRecord): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $trackRecord->update($data);

        return back()->with('success', 'Track record updated.');
    }

    public function destroyTrackRecord(TrackRecord $trackRecord): RedirectResponse
    {
        $trackRecord->delete();

        return back()->with('success', 'Track record deleted.');
    }
}
