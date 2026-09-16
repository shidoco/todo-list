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
        <main className="flex items-center justify-center px-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-lg"
            >
                <h2 className="text-center text-2xl font-bold text-slate-800">Log in</h2>

                {authError && (
                    <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
                        {authError}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="block font-semibold text-slate-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block font-semibold text-slate-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoggingOn}
                    className="w-full rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoggingOn ? 'Logging in...' : 'Log On'}
                </button>
            </form>
        </main>
    );
}

export default LoginPage;