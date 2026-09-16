import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <main className="mx-auto flex w-full max-w-4xl justify-center px-4 py-8">
            <section className="w-full max-w-2xl rounded-xl bg-white p-6 text-center shadow-lg sm:p-8">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Error 404</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-800">Page Not Found</h1>
                <p className="mt-3 text-slate-500">The page you are looking for doesn't exist or has been moved.</p>

                <section className="mt-8 border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-bold text-slate-800">Helpful links</h2>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        <li>
                            <Link className="block rounded-md bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-slate-700" to="/login">Go to Login Page</Link>
                        </li>

                        <li>
                            <Link className="block rounded-md bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-slate-700" to="/todos">View Todos</Link>
                        </li>

                        <li>
                            <Link className="block rounded-md border border-slate-300 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50" to="/profile">View Profile</Link>
                        </li>

                        <li>
                            <Link className="block rounded-md border border-slate-300 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50" to="/about">About This App</Link>
                        </li>
                    </ul>
                </section>
            </section>
        </main>
    );
}

export default NotFoundPage;