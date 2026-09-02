import { useState, useEffect, useCallback, useReducer } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer.js';
import { useAuth } from '../../contexts/AuthContext.jsx'

function TodosPage() {
  //Use Token.
  const { token } = useAuth();

  //Use Reducer State and Dispatch Updates.
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

  //Delay for Search.
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  //Set Filter Term Function.
  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newTerm });
  };

  //Fetch Todos Function.
  const fetchTodos = useCallback(async() => {

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
      
      //Fetch Success.
      if (response.status === 200) {
        const data = await response.json();
        dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: data.tasks,
        });
      //Fetch Failiure.
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.FETCH_ERROR
        });
      } else {
        throw new Error('Failed to fetch todos.');
      }
    } catch (error) {
        dispatch({ type: TODO_ACTIONS.FETCH_ERROR
        });
      }
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  //Invalidate Cache Function.
  const invalidateCache = useCallback(() => {
    fetchTodos();
  }, [fetchTodos]);

  //After Login, load todos.
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token, fetchTodos]);

  //Add todo function.
  async function addTodo(todoTitle) {

    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    //Optimistically Add Todo.
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
      // Add Success.
      if (response.status === 200 || response.status === 201) {
        const newServerTodo = await response.json();
        dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: newServerTodo });
        invalidateCache();
      //Add Failiure. Go Back To Previous TodoList State.
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

    //Find Client Todo.
    
    //Optimistically Complete Client Todo.
    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: id});

    //Patch Server Todo and Mark as Completed.
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
      //Marked Server Todo as Completed Successfully.
      if (response.status === 200) {
        //Server Todo as a Response.
        const completeServerTodo = await response.json();
        //Update Client State with Server Response.
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS, payload: { id: completeServerTodo.id, completeServerTodo }});
        invalidateCache();
        //Complete Server Todo Failiure. Reverse Client Todo Completion.
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { id }});
      } else {
        throw new Error('Failed to complete todo.');
      }
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { id }});
    }
  }

  async function updateTodo(editedTodo) {
    //Original Client Todo Pre-Update.
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    //Optimistically Update Todolist with Edited Todo and Replace Original Client Todo.
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: {id: editedTodo.id, editedTodo }});

    //Patch Sever Todo with Title and Completion status of Edited Todo. 
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
      //Update Server Todo Success.
      if (response.status === 200) {
        //Updated Server Todo Returned.
        const serverTodo = await response.json();
        //Update Client TodoList with Server Todo. Replace Client Todo.
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS, payload: { id: serverTodo.id, serverTodo }});
        invalidateCache();
      //Failiure Updating Server Todo. Restore Client Todo Back to How it Was. 
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { id: editedTodo.id, originalTodo }});
      } else {
        throw new Error('Failed to update todo.');
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
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })
          }>Reset Filters</button>
        </div>
      )}
      
      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}

      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={(newSort) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy : newSort, sortDirection }})} onSortDirectionChange={(newDir) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection: newDir }})}/>
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} dataVersion={dataVersion} />

    </div>
  );
}

export default TodosPage;