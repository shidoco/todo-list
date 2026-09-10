import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logon() {

    const { login } = useAuth();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')
    const [isLoggingOn, setIsLoggingOn] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');
        
        try {
            const result = await login(email, password);
            
            if (result.success) {
                setAuthError('');
            } else {
                setAuthError(result.error ||'Authentication failed.');
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
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

export default Logon;