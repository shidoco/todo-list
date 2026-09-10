function Header({token, onSetToken, onSetEmail}) {
  return (
    <>
    <h1>Todo List</h1>
    {token}
    </>
  );
}

export default Header;