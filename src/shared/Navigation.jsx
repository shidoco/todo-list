import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navigation() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="site-nav" aria-label="Main navigation">
            <ul className="site-nav-list">
                <li>
                    <NavLink to="/about" className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`}>
                    About
                    </NavLink>
                </li>

            { isAuthenticated ? (
                <>
                    <li>
                        <NavLink to="/todos" className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`}>
                        Todos
                        </NavLink>
                    </li>
                    <li>
                       <NavLink to="/profile" className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`}>
                       Profile
                       </NavLink> 
                    </li>
                </>
            ) : (
                <li>
                    <NavLink to="/login" className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`}>
                    Login
                    </NavLink>
                </li>
            )}
            </ul>
        </nav>
    );
}

export default Navigation;