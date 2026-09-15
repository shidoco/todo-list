function AboutPage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-8">
            <section className="space-y-8 rounded-xl bg-white p-6 shadow-lg sm:p-8">
                <header>
                    <h1 className="text-3xl font-bold text-slate-800">About TodoList</h1>
                    <p className="mt-2 text-lg text-slate-500">A task management application designed to boost productivity.</p>
                </header>

                <section className="border-t border-slate-200 pt-6">
                    <h2 className="text-xl font-bold text-slate-800">App Features</h2>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600 marker:text-slate-400">
                        <li>Task Management: Easily create, view, complete, and delete tasks.</li>
                        <li>User Authentication: Use protected routes to make sure your list stays private.</li>
                        <li>State: Keeps track of login status and user sessions.</li>
                    </ul>
                </section>

                <section className="border-t border-slate-200 pt-6">
                    <h2 className="text-xl font-bold text-slate-800">Technology Used</h2>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600 marker:text-slate-400">
                        <li>React: UI library for building state-driven component interfaces.</li>
                        <li>React Router: Handles client-side routing, protected views, and navigation.</li>
                        <li>Vite: Build tool and development server that runs React projects with extreme speed.</li>
                    </ul>
                </section>
            </section>
        </main>
    );
}

export default AboutPage;