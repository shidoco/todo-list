import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <div className="not-found-page">
            <h1> 404 - Page Not Found</h1>
            <p>The page you are looking for doesn't exist or has been moved.</p>

            <section className="nav-options">
                <h2> Here are some helpful links:</h2>
                <ul>
                    <li>
                        <Link to="/todos">Go to My Todos</Link>
                    </li>

                    <li>
                        <Link to="/profile">View Profile</Link>
                    </li>

                    <li>
                        <Link to="/about">About This App</Link>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default NotFoundPage;