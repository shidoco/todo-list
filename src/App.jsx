import './App.css'
import { useState } from 'react';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx'
import Logon from './features/Logon.jsx';
import { useAuth } from './contexts/AuthContext.jsx'

function App() {

  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Header />
      {isAuthenticated ?
        <TodosPage />
        :
        <Logon />
      }
    </div>
  );
}

export default App;
