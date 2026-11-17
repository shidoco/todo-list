import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <main className="page-container flex justify-center">
            <section className="surface-card w-full max-w-2xl p-6 text-center sm:p-9">
                <p className="text-sm font-bold uppercase tracking-wide text-[#9e3f66]">Error 404</p>
                <h1 className="page-title mt-2">Page not found</h1>
                <section className="mt-8 border-t border-[#f0e7eb] pt-6">
                    <h2 className="font-[Rubik] text-lg font-semibold text-[#44363d]">Helpful links</h2>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        <li>
                            <Link className="primary-button w-full" to="/login">Go to login</Link>
                        </li>

                        <li>
                            <Link className="primary-button w-full" to="/todos">View todos</Link>
                        </li>

                        <li>
                            <Link className="secondary-button w-full" to="/profile">View profile</Link>
                        </li>

                        <li>
                            <Link className="secondary-button w-full" to="/about">About this app</Link>
                        </li>
                    </ul>
                </section>
            </section>
        </main>
    );
}

export default NotFoundPage;