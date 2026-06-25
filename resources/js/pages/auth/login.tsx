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

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Panda Towers CMS" />

            <div className="relative min-h-screen overflow-hidden bg-accent">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-orange-500/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-125 w-125 rounded-full bg-orange-400/10 blur-3xl" />
                </div>

                <div className="relative mx-auto flex min-h-screen w-full max-w-[1800px] items-center px-6 lg:px-16">
                    {/* LEFT SIDE */}
                    <div className="hidden lg:flex lg:w-7/12 flex-col justify-center pr-24 pt-2">
                        <div className="max-w-2xl">
                            <Link href="/">
                                <img
                                    src="/Sky-Panda-Towers-Logo-1.png"
                                    alt="Panda Towers"
                                    className="mb-2 h-20 w-auto cursor-pointer"
                                />
                            </Link>

                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                                Panda Towers
                            </p>

                            <h1 className="text-xl font-bold leading-tight text-white xl:text-2xl">
                                Infrastructure
                                <span className="block text-orange-500">
                                    Management System
                                </span>
                            </h1>

                            <p className="mt-8 max-w-xl text-xl leading-relaxed text-slate-300">
                                Centralized management platform for telecom
                                towers, site operations, maintenance
                                activities, assets, compliance tracking and
                                enterprise reporting.
                            </p>

                            <div className="my-8 flex gap-12">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        99.9%
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Platform Availability
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Secure
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Enterprise Access
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Real-Time
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Operations Monitoring
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
                        <div className="w-full max-w-xl">
                            <div className="rounded-3xl bg-white p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:p-10">
                                <div className="mb-8 text-center lg:hidden">
                                    <Link href="/">
                                        <img
                                            src="/Sky-Panda-Towers-Logo-1.png"
                                            alt="Panda Towers"
                                            className="mx-auto h-14"
                                        />
                                    </Link>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Welcome Back
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Sign in to access the Panda Towers
                                        Infrastructure Management System.
                                    </p>
                                </div>

                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password']}
                                >
                                    {({ processing, errors }) => (
                                        <div className="space-y-5">
                                            <div>
                                                <Label
                                                    htmlFor="email"
                                                    className="text-sm text-slate-700"
                                                >
                                                    Email Address
                                                </Label>

                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    autoComplete="email"
                                                    placeholder="you@pandatowers.africa"
                                                    className="mt-2 border-slate-300"
                                                />

                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor="password"
                                                        className="text-sm text-slate-700"
                                                    >
                                                        Password
                                                    </Label>

                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="text-sm text-orange-600 hover:text-orange-700"
                                                        >
                                                            Forgot Password?
                                                        </TextLink>
                                                    )}
                                                </div>

                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="mt-2"
                                                />

                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                />

                                                <Label
                                                    htmlFor="remember"
                                                    className="text-sm text-slate-600"
                                                >
                                                    Remember me
                                                </Label>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-12 w-full bg-orange-500 text-white hover:bg-orange-600"
                                                data-test="login-button"
                                            >
                                                {processing && (
                                                    <Spinner className="mr-2" />
                                                )}
                                                Sign In
                                            </Button>
                                        </div>
                                    )}
                                </Form>

                                {status && (
                                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-700">
                                        {status}
                                    </div>
                                )}

                                <div className="mt-8 border-t pt-6 text-center">
                                    <p className="text-xs text-slate-500">
                                        Protected by enterprise-grade security
                                        and access controls
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page:any) => (
    <AuthCmsLayout>
        {page}
    </AuthCmsLayout>
);