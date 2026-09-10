import { useState } from 'react';

function Logoff({ token, onSetEmail, onSetToken }) {
    const [error, setError] = useState('');
    const [isLoggingOff, setIsLoggingOff] = useState(false);

    async function handleLogoff() {
        setIsLoggingOff(true);
        setError('');

        try {
            const response = await fetch('/api/users/logoff', {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': token,
                },
                credentials: 'include',
            });

            if (response.ok) {
                onSetToken('');
                onSetEmail('');
            } else {
                throw new Error('Failed to log off');
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
        <button type="button" onClick={handleLogoff} disabled={isLoggingOff}>
            {isLoggingOff ? 'Logging off...' : 'Logoff'}
        </button>
        </>
    )
}

export default Logoff;