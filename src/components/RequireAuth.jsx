import { useLocation, useNavigate } from "react-router";
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect( () => {
        if (!isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: {from: location},
            });
        }
    }, [isAuthenticated, navigate, location]);

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    return children;
}

export default RequireAuth;


