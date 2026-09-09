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
        <>
        
            {authError && <div>{authError}</div>}

            <form onSubmit={handleSubmit}>
            
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
            
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
            
                <button type="submit" disabled={isLoggingOn}>
                    {isLoggingOn ? 'Logging in...' : 'Log On'}
                </button>
            </form>
        </>
    );
}

export default LoginPage;