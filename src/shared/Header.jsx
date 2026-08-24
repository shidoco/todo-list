function Header({ token, onSetToken, onSetEmail }) {
  const headerToken = {token};
  const headerSetToken = {onSetToken};
  const headerSetEmail = {onSetEmail};
  
  return (
    <h1>Todo List</h1>
  );
}

export default Header;