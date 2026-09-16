import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navigation() {
    const { isAuthenticated } = useAuth();

    const navLinkStyle = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        textDecoration: isActive ? 'underline' : 'none',
    });

    return (
        <nav>
            <ul className="flex gap-10 justify-center"
            >
                <li>
                    <NavLink to="/about" style={navLinkStyle}>
                    About
                    </NavLink>
                </li>

            { isAuthenticated ? (
                <>
                    <li>
                        <NavLink to="/todos" style={navLinkStyle}>
                        Todos
                        </NavLink>
                    </li>
                    <li>
                       <NavLink to="/profile" style={navLinkStyle}>
                       Profile
                       </NavLink> 
                    </li>
                </>
            ) : (
                <li>
                    <NavLink to="/login" style={navLinkStyle}>
                    Login
                    </NavLink>
                </li>
            )}
            </ul>
        </nav>
    );
}

export default Navigation;