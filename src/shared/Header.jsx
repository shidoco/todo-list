import Logoff from '../features/Logoff.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header>
      <h1 className="text-center py-5 font-bold text-4xl">Todo List</h1>
      <Navigation />
      <div className="flex justify-center px-4 pb-4 mt-5">
        {isAuthenticated && <Logoff/>}
      </div>
  </header>
  );
}

export default Header;