function AboutPage() {
    return (
        <div>
            <h1>About TodoList</h1>
            <p> A task management application designed to boost productivity.</p>

            <section className="features">
                <h2>App Features</h2>
                <ul>
                    <li>Task Management: Easily create, view, complete, and delete tasks.</li>
                    <li>User Authentication: Use protected routes to make sure your list stays private.</li>
                    <li>State: Keeps track of login status and user sessions.</li>
                </ul>
            </section>

            <section className="tech">
                <h2>Technology Used</h2>
                <ul>
                    <li>React: UI library for building state-driven component interfaces.</li>
                    <li>React Router: Handles client-side routing, protected views, and navigation.</li>
                    <li>Vite: Build tool and development server that runs React projects with extreme speed.</li>
                </ul>
            </section>
        </div>
    );
}

export default AboutPage;