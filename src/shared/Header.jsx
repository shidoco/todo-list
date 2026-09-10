import Logoff from '../features/Logoff.jsx';

function Header({token, onSetToken, onSetEmail}) {
  return (
    <>
    <header>
    <h1>Todo List</h1>
    <div>
      {token && (
        <Logoff
          token={token}
          onSetToken={onSetToken}
          onSetEmail={onSetEmail}
        />
      )}
    </div>
    </header>
    </>
  );
}

export default Header;