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
  const [user, setUser] = useState('');
  
  const login = async (userEmail, password) => {
    try {
        const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
        };
    
        const response = await fetch('/api/users/logon', options);
        const data = await response.json();
    
        if (response.status === 200 && data.name && data.csrfToken) {
        // Success: Update state
            setUser(data);
            setEmail(data.email);
            setToken(data.csrfToken);
            return { success: true };
        } else {
        // Failure: Return error
            return {
                success: false,
                error: `Authentication failed: ${data?.message}`,
        };
        }
    } catch {
        return {
            success: false,
            error: 'Network error during login',
        };
    }
    };

    const logout = async () => {

        if (!token) {
            setUser('');
            setEmail('');
            setToken('');
            return { success: true, 
                message: 'No active session token found.'};
        }

        try {
            const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token, },
            credentials: 'include',
            };
    
            const response = await fetch('/api/users/logoff', options);
            const data = await response.json();
    
            if (response.status === 200 || response.ok) {
            // Success: Update state
            setUser('');
            setEmail('');
            setToken('');
            return { 
                success: true, 
                error: ''
            };
            } else {
            // Failure: Return error
            return {
                success: false,
                error: `Authentication failed: ${data?.message}`,
            };
            }
        } catch {
            return {
            success: false,
            error: 'Network error during logoff',
            };
        } finally {
            setUser('');
            setEmail('');
            setToken('');
        }
    };
  
  const value = {
    user,
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