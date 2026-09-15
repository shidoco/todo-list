import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';

function Logoff() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [isLoggingOff, setIsLoggingOff] = useState(false);

    async function handleLogoff() {
        setIsLoggingOff(true);
        setError('');

        try {
            const result = await logout();
            if (result.success) {
                navigate('/login');
            } else {
                throw new Error(`Failed to Logout: ${result.error}`)
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setIsLoggingOff(false);
        }
    }

    return (
        <>
        
            {error && <div>{error}</div>}

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

export default Logoff;
