function AboutPage() {
    return (
        <main className="page-container">
            <section className="surface-card space-y-8 p-5 sm:p-9">
                <header>
                    <h1 className="page-title">About TodoList</h1>
                </header>

                <section className="border-t border-[#f0e7eb] pt-6">
                    <h2 className="font-[Rubik] text-xl font-semibold text-[#44363d]">Features</h2>
                    <ul className="mt-4 grid gap-3 text-[#665861] sm:grid-cols-3">
                        <li className="rounded-2xl bg-[#fcf8fa] p-4 leading-6">Task management: Create, view, complete, and delete tasks.</li>
                        <li className="rounded-2xl bg-[#fcf8fa] p-4 leading-6">Authentication: Keep your todo list private.</li>
                        <li className="rounded-2xl bg-[#fcf8fa] p-4 leading-6">Session state: Stay signed in to your account.</li>
                    </ul>
                </section>

                <section className="border-t border-[#f0e7eb] pt-6">
                    <h2 className="font-[Rubik] text-xl font-semibold text-[#44363d]">Technology</h2>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-[#665861] marker:text-[#c27b98]">
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