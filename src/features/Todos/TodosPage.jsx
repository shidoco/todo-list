import { useState, useEffect } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);
    
      try {
        const params = new URLSearchParams({
            limit: 100,
        })
        const response = await fetch(`/api/tasks?${params}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });
        
        if (response.status === 200) {
          const data = await response.json();
          setTodoList(data.tasks);
          setError('');
        } else if (response.status === 401) {
          throw new Error('Unauthorized.')
        } else {
          throw new Error('Failed to fetch todos');
        }
      } catch (error) {
        setError(error.message || 'An error occurred while fetching todos');
      } finally {
        setIsTodoListLoading(false);
      }
    }
    
    if (token) {
      fetchTodos();
    }

    }, [token]);

  async function addTodo(todoTitle) {

    setIsTodoListLoading(true);

    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]);

    try {
      const response = await fetch(`/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (response.status === 200 || response.status === 201) {
        const serverTodo = await response.json();
        setTodoList((previous) => 
          previous.map((todo) => todo.id === newTodo.id ? serverTodo : todo)
        );
        setError('');
      } else {
        throw new Error('Failed to add todo');
        setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
      }
    } catch (error) {
      setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
      setError(error.message || 'Failed to add todo');
    } finally {
      setIsTodoListLoading(false);
    }
  }

  async function completeTodo(id) {

    setIsTodoListLoading(true);

    const originalTodo = todoList.find((todo) => todo.id === id);

    const completedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    
    setTodoList(completedTodos);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
      });

      if (response.status === 200) {
        const serverTodo = await response.json();
        setTodoList((previous) =>
          previous.map((todo) => todo.id === id ? serverTodo : todo)
        );
        setError('');
      } else if (response.status === 204) {
        setError('');
      } else {
        throw new Error('Failed to complete todo');
        setTodoList((previous) =>
        previous.map((todo) => todo.id === id ? originalTodo : todo))
      }
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) => todo.id === id ? originalTodo : todo)
      );
      setError(error.message || 'Failed to complete todo');
    } finally {
      setIsTodoListLoading(false);
    }
  }

  async function updateTodo(editedTodo) {

    setIsTodoListLoading(true);

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? editedTodo : todo
    );
    setTodoList(updatedTodos);

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted }),
      });

      if (response.status === 200) {
        const serverTodo = await response.json();
        setTodoList((previous) =>
          previous.map((todo) => todo.id === editedTodo.id ? serverTodo : todo)
        );
        setError('');
      } else if (response.status === 204) {
        setError('');
      } else {
        throw new Error('Failed to update todo');
        setTodoList((previous) =>
        previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo)
      );
      }
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo)
      );
      setError(error.message || 'Failed to update todo');
    } finally {
      setIsTodoListLoading(false);
    }
  }
  
  return (
    <div>
      {error && (
        <div>
          <div>{error}</div>
          <button onClick={() => setError('')}>Clear Error</button>
        </div>
      )}
      
      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}
      
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  );
}

export default TodosPage;