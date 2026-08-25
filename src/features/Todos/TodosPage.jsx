import { useState, useEffect, useCallback } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx'
import FilterInput from '../../shared/FilterInput.jsx'
import useDebounce from '../../utils/useDebounce.js'

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('')

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);
  
  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);
    
      try {
        const paramsObject = { sortBy, sortDirection, limit: 100 };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);
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
          setFilterError('');
          setError('');
        } else if (response.status === 401) {
          throw new Error('Unauthorized.')
        } else {
          throw new Error('Failed to fetch todos');
        }
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`An error occurred while fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }
    
    if (token) {
      fetchTodos();
    }

    }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle) {

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
        invalidateCache();
      } else if (response.status === 401) {
        setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
        throw new Error('Failed to add todo')
      } else {
        throw new Error('Failed to add todo');
      }
    } catch (error) {
      setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
      setError(error.message || 'Failed to add todo');
    }
  }

  async function completeTodo(id) {

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
        invalidateCache();
      } else if (response.status === 401) {
        setTodoList((previous) =>
        previous.map((todo) => todo.id === id ? originalTodo : todo));
        throw new Error('Failed to complete todo');
      } else {
        throw new Error('Failed to complete todo');
      }
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) => todo.id === id ? originalTodo : todo));
      setError(error.message || 'Failed to complete todo');
    }
  }

  async function updateTodo(editedTodo) {

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
        invalidateCache();
      } else if (response.status === 401) {
        setTodoList((previous) =>
        previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo)
        );
        throw new Error('Failed to update todo');
      } else {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo)
      );
      setError(error.message || 'Failed to update todo');
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

      {filterError && (
        <div>
          <p>{filterError}</p>
          <button onClick={() => setFilterError('')}>Clear Filter Error</button>
          <button onClick={() => {
            setFilterTerm('');
            setSortBy('createdAt');
            setSortDirection('desc');
            setFilterError('');
          }}>Reset Filters</button>
        </div>
      )}
      
      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}

      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} dataVersion={dataVersion} />

    </div>
  );
}

export default TodosPage;