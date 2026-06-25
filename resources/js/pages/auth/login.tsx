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

const features = [
    { icon: '🏗️', label: 'Hero & Page Sections' },
    { icon: '🏠', label: 'Unit Types & Pricing' },
    { icon: '📝', label: 'Blog & FAQ Content' },
    { icon: '📊', label: 'Project Updates' },
    { icon: '💬', label: 'Testimonials' },
    { icon: '⚙️', label: 'Site Settings' },
];

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Sign In — Panda Towers CMS" />

            {/* Full-page green gradient matching sidebar */}
            <div className="relative min-h-screen overflow-hidden" style={{ background: 'oklch(0.18 0.06 155)' }}>

                {/* Subtle texture layers */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Lighter green radial top-left */}
                    <div
                        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[140px]"
                        style={{ background: 'oklch(0.45 0.12 155 / 0.18)' }}
                    />
                    {/* Slightly lighter bottom-right */}
                    <div
                        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[140px]"
                        style={{ background: 'oklch(0.38 0.10 155 / 0.14)' }}
                    />
                    {/* Faint building image */}
                    <img
                        src="/panda-towers-render.jpg"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ opacity: 0.06, mixBlendMode: 'luminosity' }}
                    />
                    {/* Dot grid overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(circle, oklch(0.7 0 0 / 0.04) 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                </div>

                <div className="relative flex min-h-screen items-center justify-center px-4 py-16 lg:px-10">
                    <div className="w-full max-w-5xl">
                        <div className="grid lg:grid-cols-5 gap-16 items-center">

                            {/* ── LEFT: Brand panel ── */}
                            <div className="hidden lg:flex lg:col-span-3 flex-col gap-10">

                                {/* Logo + name */}
                                <Link href="/" className="flex items-center gap-4 w-fit group">
                                    <div
                                        className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                                        style={{ background: 'oklch(0.32 0.09 155)' }}
                                    >
                                        <img
                                            src="/Sky-Panda-Towers-Logo-1-removebg-preview.png"
                                            alt="Panda Towers 001"
                                            className="h-10 w-10 object-contain drop-shadow"
                                        />
                                    </div>
                                    <div>
                                        <p
                                            className="text-xs font-bold uppercase tracking-widest mb-0.5"
                                            style={{ color: 'oklch(0.75 0.18 155)' }}
                                        >
                                            Content Management
                                        </p>
                                        <h1 className="text-2xl font-bold text-white leading-none">
                                            Panda Towers 001
                                        </h1>
                                    </div>
                                </Link>

                                {/* Headline */}
                                <div>
                                    <h2
                                        className="text-4xl xl:text-5xl font-bold leading-tight mb-5"
                                        style={{ color: 'oklch(0.96 0 0)' }}
                                    >
                                        Your investment{' '}
                                        <span style={{ color: 'oklch(0.75 0.18 155)' }}>
                                            platform,
                                        </span>
                                        <br />
                                        fully in control.
                                    </h2>
                                    <p className="text-base leading-relaxed max-w-md" style={{ color: 'oklch(0.65 0.04 155)' }}>
                                        Manage unit listings, hero content, blog posts, project updates,
                                        and all site settings for Panda Towers 001 from one secure dashboard.
                                    </p>
                                </div>

                                {/* Quick-access feature grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {features.map((f) => (
                                        <div
                                            key={f.label}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                            style={{
                                                background: 'oklch(0.26 0.08 155 / 0.7)',
                                                border: '1px solid oklch(0.34 0.08 155)',
                                            }}
                                        >
                                            <span className="text-lg leading-none">{f.icon}</span>
                                            <span className="text-sm font-medium" style={{ color: 'oklch(0.85 0.05 155)' }}>
                                                {f.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── RIGHT: Login card ── */}
                            <div className="lg:col-span-2 w-full">
                                <div
                                    className="rounded-2xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
                                    style={{
                                        background: 'oklch(0.99 0 0)',
                                        border: '1px solid oklch(0.94 0 0)',
                                    }}
                                >
                                    {/* Mobile logo */}
                                    <div className="mb-7 flex items-center gap-3 lg:hidden">
                                        <img
                                            src="/Sky-Panda-Towers-Logo-1-removebg-preview.png"
                                            alt="Panda Towers 001"
                                            className="h-9 w-9 object-contain"
                                        />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CMS</p>
                                            <p className="text-sm font-bold text-slate-800">Panda Towers 001</p>
                                        </div>
                                    </div>

                                    {/* Heading */}
                                    <div className="mb-7">
                                        <div
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                                            style={{ background: 'oklch(0.93 0.08 155)', color: 'oklch(0.32 0.12 155)' }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                                            Admin portal
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h3>
                                        <p className="text-sm text-slate-500">Enter your credentials to continue</p>
                                    </div>

                                    <Form {...store.form()} resetOnSuccess={['password']}>
                                        {({ processing, errors }) => (
                                            <div className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
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
                                                        className="h-11 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                                                    />
                                                    <InputError message={errors.email} />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                                            Password
                                                        </Label>
                                                        {canResetPassword && (
                                                            <TextLink
                                                                href={request()}
                                                                className="text-xs font-medium"
                                                                style={{ color: 'oklch(0.49 0.165 155)' }}
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
                                                        className="h-11 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>

                                                <div className="flex items-center gap-2.5">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        className="border-slate-300 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                                    />
                                                    <Label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer">
                                                        Keep me signed in
                                                    </Label>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="h-11 w-full font-semibold text-sm text-white shadow-sm"
                                                    style={{
                                                        background: 'linear-gradient(135deg, oklch(0.46 0.14 155) 0%, oklch(0.38 0.12 155) 100%)',
                                                        border: 'none',
                                                    }}
                                                >
                                                    {processing ? (
                                                        <><Spinner className="mr-2" /> Signing in…</>
                                                    ) : (
                                                        'Sign In to Dashboard'
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </Form>

                                    {status && (
                                        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-700">
                                            {status}
                                        </div>
                                    )}

                                    <div className="mt-7 pt-6 border-t border-slate-100 text-center">
                                        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Secured admin access · Panda Towers 001
                                        </p>
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
