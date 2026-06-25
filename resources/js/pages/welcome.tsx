import { Head, Link, usePage } from '@inertiajs/react';

const dashboard = () => '/cms';
const login = () => '/login';

export default function Welcome() {
const { auth } = usePage().props;

return (
    <>
        <Head title="Panda Towers CMS" />

        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-100 flex flex-col">

            {/* NAVBAR */}
            <header className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-lg font-semibold text-accent tracking-tight">
                    Panda Towers CMS
                </h1>

                <nav>
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="px-4 py-2 rounded-lg bg-accent text-white text-sm hover:bg-orange-500 transition"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="px-4 py-2 rounded-lg border border-accent dark:border-gray-700 text-sm hover:border-transparent hover:bg-orange-500 hover:text-white dark:hover:bg-gray-800 transition"
                        >
                            Admin Login
                        </Link>
                    )}
                </nav>
            </header>

            {/* HERO */}
            <main className="flex-1 flex items-center">
                <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">

                    {/* LEFT CONTENT */}
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-accent leading-tight">
                            Manage Panda Towers Infrastructure & Content
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                            Secure internal CMS for managing tower deployments,
                            network data, site updates, and operational content
                            across Africa.
                        </p>

                        {!auth.user && (
                            <Link
                                href={login()}
                                className="inline-block mt-4 px-6 py-3 bg-accent text-white rounded-lg text-sm font-medium hover:bg-orange-500 transition"
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
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-125" />

                            <img
                                src="/exterior.jpg"
                                alt="Panda Towers Infrastructure"
                                className="relative z-10 h-112.5 w-auto rounded-2xl animate-float"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* FEATURES */}
            <section className="bg-white dark:bg-[#0f0f0f] py-12">
                <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-orange-500 mb-2">Tower Management</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Track, update, and manage panda towers infrastructure efficiently.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-orange-500 mb-2">Operational Insights</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Access real-time data and analytics across all sites.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-orange-500 mb-2">Secure Access</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Role-based authentication ensures only authorized personnel access the system.
                        </p>
                    </div>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="text-center text-xs text-accent dark:text-gray-600 py-6">
                © {new Date().getFullYear()} Panda Towers. Internal CMS System.
            </footer>

        </div>
    </>
);

}
