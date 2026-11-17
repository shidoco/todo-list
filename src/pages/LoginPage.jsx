import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);
    const [authError, setAuthError] = useState('');

    const from = location.state?.from?.pathname || '/todos';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, {replace: true});
        }
    }, [isAuthenticated, navigate, from]);

    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoggingOn(true);
        setAuthError('');
        
        try {
            const result = await login(email, password);
            
            if (result.success) {
                navigate(from, {replace: true});
            } else {
                setAuthError(result.error ||'Authentication failed.');
            }
        } catch (error) {
            setAuthError(`Error logging in: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    }

    return (
        <main className="page-container flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="surface-card w-full max-w-md space-y-6 p-6 sm:p-9"
            >
                <header className="text-center">
                    <h1 className="page-title text-3xl">Log in</h1>
                </header>

                {authError && (
                    <div className="status-message text-sm" role="alert">
                        {authError}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="field-label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="field-control"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="field-label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="field-control"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoggingOn}
                    className="primary-button w-full"
                >
                    {isLoggingOn ? 'Logging in...' : 'Log On'}
                </button>
            </form>
        </main>
    );
}

export default LoginPage;