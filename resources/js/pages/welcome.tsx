import { Head, Link, usePage } from '@inertiajs/react';

const dashboard = () => '/cms';
const login = () => '/login';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Panda Towers CMS" />

            <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800 dark:bg-[#0a0a0a] dark:text-gray-100">
                {/* NAVBAR */}
                <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                    <h1 className="text-lg font-semibold tracking-tight text-accent">
                        Panda Towers CMS
                    </h1>

                    <nav className="flex items-center gap-3">
                        <Link
                            href="/blog"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:text-accent dark:text-gray-200"
                        >
                            Website Blog
                        </Link>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-accent px-4 py-2 text-sm text-white transition hover:bg-orange-500"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-lg border border-accent px-4 py-2 text-sm transition hover:border-transparent hover:bg-orange-500 hover:text-white dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                Admin Login
                            </Link>
                        )}
                    </nav>
                </header>

                {/* HERO */}
                <main className="flex flex-1 items-center">
                    <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
                        {/* LEFT CONTENT */}
                        <div className="space-y-6">
                            <h2 className="text-3xl leading-tight font-bold text-accent sm:text-4xl">
                                Manage Panda Towers Infrastructure & Content
                            </h2>

                            <p className="text-base text-gray-600 sm:text-lg dark:text-gray-400">
                                Secure internal CMS for managing tower
                                deployments, network data, site updates, and
                                operational content across Africa.
                            </p>

                            {!auth.user && (
                                <Link
                                    href={login()}
                                    className="mt-4 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-500"
                                >
                                    Access CMS
                                </Link>
                            )}
                        </div>

                        {/* RIGHT VISUAL */}
                        {/* <div className="hidden lg:block">
                        <div className="w-full h-80 rounded-2xl bg-linear-to-br from-green-100 to-green-400 flex items-center justify-center text-white text-sm opacity-90">
                            Panda Towers Infrastructure Preview
                        </div>
                    </div> */}

                        {/* RIGHT VISUAL */}
                        <div className="hidden items-center justify-center lg:flex">
                            <div className="relative">
                                <div className="absolute inset-0 scale-125 rounded-full bg-accent/20 blur-3xl" />

                                <img
                                    src="/exterior.jpg"
                                    alt="Panda Towers Infrastructure"
                                    className="animate-float relative z-10 h-112.5 w-auto rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* FEATURES */}
                <section className="bg-white py-12 dark:bg-[#0f0f0f]">
                    <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                            <h3 className="mb-2 font-semibold text-orange-500">
                                Tower Management
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Track, update, and manage panda towers
                                infrastructure efficiently.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                            <h3 className="mb-2 font-semibold text-orange-500">
                                Operational Insights
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Access real-time data and analytics across all
                                sites.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                            <h3 className="mb-2 font-semibold text-orange-500">
                                Secure Access
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Role-based authentication ensures only
                                authorized personnel access the system.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-6 text-center text-xs text-accent dark:text-gray-600">
                    © {new Date().getFullYear()} Panda Towers. Internal CMS
                    System.
                </footer>
            </div>
        </>
    );
}
