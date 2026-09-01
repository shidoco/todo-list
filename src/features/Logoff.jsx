import { useState } from 'react';

function Logoff({ token, onSetEmail, onSetToken }) {
    const [authError, setAuthError] = useState('');
    const [isLoggingOff, setIsLoggingOff] = useState(false);

    async function handleLogoff() {
        setIsLoggingOff(true);

        try {
            const response = await fetch(`/api/users/logoff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': token,
                },
                credentials: 'include',
            });

            if (response.status === 200 || response.ok) {
                onSetEmail('');
                onSetToken('');
                setAuthError('');
            } else {
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

export default Logoff;
