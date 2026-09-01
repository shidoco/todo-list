import Logon from '/Users/swarren/Desktop/CTD-repos/sydni-warren-reactctd/Todo-List/todo-list/src/features/Logon.jsx';
import Logoff from '/Users/swarren/Desktop/CTD-repos/sydni-warren-reactctd/Todo-List/todo-list/src/features/Logoff.jsx';

function Header({token, onSetToken, onSetEmail}) {
  return (
    <header>
    <h1>Todo List</h1>

    <div>
      { token && 
        (<Logoff
        token={token}
        onSetToken={onSetToken}
        onSetEmail={onSetEmail}/>)
      }
    </div>
  </header>
  );
}

export default Header;