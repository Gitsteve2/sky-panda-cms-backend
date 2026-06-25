import { Form, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthCmsLayout from '@/layouts/auth/auth-cms-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

const stats = [
    { value: '140', label: 'Total Units' },
    { value: '12%', label: 'Avg. Yield' },
    { value: '100%', label: 'Occupancy' },
];

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Sign In — Panda Towers CMS" />

            <div className="relative min-h-screen overflow-hidden" style={{ background: '#0f1318' }}>

                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <img
                        src="/panda-towers-render.jpg"
                        alt=""
                        className="h-full w-full object-cover"
                        style={{ opacity: 0.18 }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f1318 0%, #1a1f2e 40%, #0f1318 100%)' }} />
                </div>

                {/* Gold glow accents */}
                <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full blur-[120px]" style={{ background: 'rgba(201,162,39,0.08)' }} />
                <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-[120px]" style={{ background: 'rgba(201,162,39,0.06)' }} />

                <div className="relative flex min-h-screen items-center justify-center px-4 py-12 lg:px-8">
                    <div className="w-full max-w-5xl">
                        <div className="grid lg:grid-cols-5 gap-12 items-center">

                            {/* ── LEFT PANEL ── */}
                            <div className="hidden lg:flex lg:col-span-3 flex-col gap-10">

                                {/* Logo + wordmark */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/Sky-Panda-Towers-Logo-1-removebg-preview.png"
                                        alt="Panda Towers 001"
                                        className="h-16 w-auto drop-shadow-2xl"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: '#c9a227' }}>
                                            Content Management
                                        </p>
                                        <h1 className="text-2xl font-bold text-white leading-tight">
                                            Panda Towers 001
                                        </h1>
                                    </div>
                                </div>

                                {/* Headline */}
                                <div>
                                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                                        Manage your
                                        <span className="block mt-1" style={{ color: '#c9a227' }}>
                                            investment platform
                                        </span>
                                    </h2>
                                    <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                                        Control every aspect of the Panda Towers 001 website — hero content,
                                        unit listings, testimonials, blog posts, and project updates — from
                                        one secure dashboard.
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-8">
                                    {stats.map((s) => (
                                        <div key={s.label} className="flex flex-col gap-1">
                                            <span className="text-3xl font-bold text-white">{s.value}</span>
                                            <span className="text-sm text-slate-500">{s.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Feature pills */}
                                <div className="flex flex-wrap gap-2">
                                    {['Hero & Sections', 'Unit Types', 'Blog Posts', 'Project Updates', 'Testimonials', 'Site Settings'].map((f) => (
                                        <span
                                            key={f}
                                            className="px-3 py-1.5 rounded-full text-xs font-medium border"
                                            style={{ borderColor: 'rgba(201,162,39,0.3)', color: '#c9a227', background: 'rgba(201,162,39,0.06)' }}
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* ── RIGHT PANEL – Login card ── */}
                            <div className="lg:col-span-2 w-full">
                                <div
                                    className="rounded-2xl p-8 shadow-2xl"
                                    style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
                                >
                                    {/* Mobile logo */}
                                    <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                                        <img src="/Sky-Panda-Towers-Logo-1-removebg-preview.png" alt="Panda Towers 001" className="h-10" />
                                        <span className="text-white font-bold">Panda Towers 001</span>
                                    </div>

                                    <div className="mb-7">
                                        <h3 className="text-xl font-bold text-white mb-1">Welcome back</h3>
                                        <p className="text-sm text-slate-400">Sign in to your CMS account</p>
                                    </div>

                                    <Form {...store.form()} resetOnSuccess={['password']}>
                                        {({ processing, errors }) => (
                                            <div className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="email" className="text-sm text-slate-300">
                                                        Email address
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        autoComplete="email"
                                                        placeholder="you@pandatowers.africa"
                                                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                                                    />
                                                    <InputError message={errors.email} />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="password" className="text-sm text-slate-300">
                                                            Password
                                                        </Label>
                                                        {canResetPassword && (
                                                            <TextLink
                                                                href={request()}
                                                                className="text-xs"
                                                                style={{ color: '#c9a227' }}
                                                            >
                                                                Forgot password?
                                                            </TextLink>
                                                        )}
                                                    </div>
                                                    <PasswordInput
                                                        id="password"
                                                        name="password"
                                                        required
                                                        autoComplete="current-password"
                                                        placeholder="••••••••"
                                                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>

                                                <div className="flex items-center gap-2.5">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        className="border-white/20 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                                                    />
                                                    <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                                                        Keep me signed in
                                                    </Label>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="h-11 w-full font-semibold text-sm text-white"
                                                    style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a07d18 100%)', border: 'none' }}
                                                >
                                                    {processing ? (
                                                        <><Spinner className="mr-2" /> Signing in…</>
                                                    ) : (
                                                        'Sign In to CMS'
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </Form>

                                    {status && (
                                        <div className="mt-5 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center text-sm text-green-400">
                                            {status}
                                        </div>
                                    )}

                                    <div className="mt-7 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-600">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Secure admin access · Panda Towers 001
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page: any) => (
    <AuthCmsLayout>{page}</AuthCmsLayout>
);
