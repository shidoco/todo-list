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
            await logout();
            navigate('/login');
        } catch (error) {
            setError(`Error: ${error.message}`);
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
