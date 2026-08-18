import { useState } from 'react';

function Logon({onSetEmail, onSetToken}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')
    const [isLoggingOn, setIsLoggingOn] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoggingOn(true);
        
        try {
            const response = await fetch(`/api/users/logon`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (response.status === 200 && data.name && data.csrfToken) {
                onSetEmail(data.name);
                onSetToken(data.csrfToken);
                setAuthError('');
            } else {
                setAuthError(`Authentication failed: ${data?.message}`);
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {authError && <div>{authError}</div>}
            
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            
            <button type="submit" disabled={isLoggingOn}>
                {isLoggingOn ? 'Logging in...' : 'Log On'}
            </button>
        </form>
    );
}

export default Logon;