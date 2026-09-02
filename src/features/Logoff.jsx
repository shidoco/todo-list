import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logout() {
    const { logout } = useAuth();

    const [authError, setAuthError] = useState('');
    const [isLoggingOff, setIsLoggingOff] = useState(false);

    async function handleLogoff() {
        setIsLoggingOff(true);
        setAuthError('');

        try {
            const result = await logout();

            if (!result.success) {
                setAuthError('Logoff failed.');
            }
        } catch (error) {
            setAuthError(`Error: ${error.message}`);
        } finally {
            setIsLoggingOff(false);
        }
    }

    return (
        <>
        
            {authError && <div>{authError}</div>}

            <button
                type="button"
                onClick={handleLogoff}
                disabled={isLoggingOff}
            >
                {isLoggingOff ? 'Logging Off...' : 'Log Off'}
            </button>
        </>
    );
}

export default Logout;
