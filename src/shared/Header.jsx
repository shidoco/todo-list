import Logon from '../features/Logon.jsx';
import Logoff from '../features/Logoff.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header>
    <h1>Todo List</h1>

    <div>
      {isAuthenticated && <Logoff />}
    </div>
  </header>
  );
}

export default Header;