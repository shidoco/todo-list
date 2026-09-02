import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  
  const login = async (userEmail, password) => {
    try {
        const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
        };
    
        const res = await fetch('/api/users/logon', options);
        const data = await res.json();
    
        if (res.status === 200 && data.name && data.csrfToken) {
        // Success: Update state
            setEmail(data.name);
            setToken(data.csrfToken);
            return { success: true };
        } else {
        // Failure: Return error
            return {
                success: false,
                error: `Authentication failed: ${data?.message}`,
        };
        }
    } catch (error) {
        return {
            success: false,
            error: 'Network error during login.',
        };
    }
    };

    const logout = async () => {

        if (!token) {
            setEmail('');
            setToken('');
            return { success: true, message: 'No active session token found.'};
        }

        try {
            const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token, },
            credentials: 'include',
            };
    
            const res = await fetch('/api/users/logoff', options);
            const data = await res.json();
    
            if (res.status === 200 || res.ok) {
            // Success: Update state
            setEmail('');
            setToken('');
            return { success: true };
            } else {
            // Failure: Return error
            return {
                success: false,
                error: 'Authentication failed.',
            };
            }
        } catch (error) {
            return {
            success: false,
            error: 'Network error during logoff.',
            };
        } finally {
            setEmail('');
            setToken('');
        }
    };
  
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}