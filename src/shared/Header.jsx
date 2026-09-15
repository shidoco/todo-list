import Logoff from '../features/Logoff.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header>
    <h1>Todo List</h1>
    <Navigation />
    <div>
      {isAuthenticated && <Logoff />}
    </div>
  </header>
  );
}

export default Header;