import { useState, useEffect, useCallback, useReducer } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer.js';
import { useAuth } from '../../contexts/AuthContext.jsx'

function TodosPage() {

  const { token } = useAuth();

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection }});
  }, [sortBy, sortDirection]);
  
  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newTerm });
  };

  useEffect(() => {
    async function fetchTodos() {

      dispatch({ type: TODO_ACTIONS.FETCH_START });
    
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
          dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: data.tasks,
          });
        } else if (response.status === 401) {
          dispatch({ type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: 'Error fetching todos: Unauthorized.', isFilterError: false,
            },
          });
        } else {
          throw new Error('Failed to fetch todos');
        }
      } catch (error) {
        const isFilter = debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc'; {
          dispatch({ type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: isFilter ? `Error filtering/sorting todos: ${error.message}` : `Error fetching todos: ${error.message}`, isFilterError: isFilter,
            }
          });
        }
      }
    }
    
    if (token) {
      fetchTodos();
    }

    }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

  async function addTodo(todoTitle) {

    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: newTodo });

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
        dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: serverTodo });
        invalidateCache();
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: newTodo.id });
      } else {
        throw new Error('Failed to add todo.');
      }
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: newTodo.id });
    }
  }

  async function completeTodo(id) {

    const originalTodo = todoList.find((todo) => todo.id === id);
    
    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: id});

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
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS, payload: { id, serverTodo }});
        invalidateCache();
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { id, originalTodo }});
      } else {
        throw new Error('Failed to complete todo.');
      }
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { id, originalTodo }});
    }
  }

  async function updateTodo(editedTodo) {

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: editedTodo });

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
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS, payload: serverTodo });
        invalidateCache();
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { id: editedTodo.id, originalTodo }});
      } else {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { id: editedTodo.id, originalTodo }});
    }
  }
  
  return (
    <div>

      {error && (
        <div>
          <div>{error}</div>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>Clear Error</button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>Clear Filter Error</button>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })
          }>Reset Filters</button>
        </div>
      )}
      
      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}

      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={(newSort) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection }})} onSortDirectionChange={(newDir) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection: newDir }})}/>
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} dataVersion={dataVersion} />

    </div>
  );
}

export default TodosPage;