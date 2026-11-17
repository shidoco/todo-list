import Logoff from '../features/Logoff.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';
import { Link } from 'react-router';

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand-link" to={isAuthenticated ? '/todos' : '/login'}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Todo List</span>
        </Link>
        <Navigation />
        <div className="header-action">
          {isAuthenticated && <Logoff />}
        </div>
      </div>
    </header>
  );
}

export default Header;