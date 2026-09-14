import { useState, useEffect, useCallback, useReducer } from 'react';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import useDebounce from '../utils/useDebounce.js';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../reducers/todoReducer.js';
import { useAuth } from '../contexts/AuthContext.jsx'
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter.jsx';

function TodosPage() {
  //Use Token.
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  //Use Reducer State and Dispatch Updates.
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const statusFilter = searchParams.get('status') || 'all';
  
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
  const debouncedLoading = useDebounce(isTodoListLoading, 500);

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
      if (response.status === 200 || response.status === 404) {
        const data = response.status === 404
          ? { tasks: [] }
          : await response.json();
        dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: data.tasks,
        });
      //Fetch Failiure.
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.FETCH_ERROR, payload: { message: 'Error fetching todos: Unauthorized.'}
        });
      } else {
        throw new Error(`Failed to fetch todos: ${response.status}`);
      }
    } catch (error) {
        dispatch({ type: TODO_ACTIONS.FETCH_ERROR,
          payload: { message: `Error fetching todos: ${error.message}`}
        });
      }
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  //Invalidate Cache Function.
  const invalidateCache = useCallback(() => {
    fetchTodos();
  }, [fetchTodos, sortBy, sortDirection]);

  //After Login, load todos.
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token, fetchTodos]);

  //Add todo function.
  async function addTodo(todoTitle) {

    //New Client Todo Created With Input Title.
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    //Optimistically Add Client Todo to Local State.
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
        //Retrieve Todo from Server.
        const newServerTodo = await response.json();
        //Replace Client Todo with Server Todo.
        dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: { id: newTodo.id, serverTodo: newServerTodo }});
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
    const originalTodo = todoList.find((todo) => todo.id === id);

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
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS, payload: { id: completeServerTodo.id, serverTodo: completeServerTodo }});
        invalidateCache();
        //Complete Server Todo Failiure. Restore Orginial Incomplete Todo to TodoList. 
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { id, og: originalTodo }});
      } else {
        throw new Error('Failed to complete todo.');
      }
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { id, og: originalTodo }});
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
      //Failiure Updating Server Todo. Restore Client Todo Back to Original Todo. 
      } else if (response.status === 401) {
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { id: editedTodo.id, originalTodo }});
      } else {
        throw new Error('Failed to update todo.');
      }
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { id: editedTodo.id, originalTodo }});
    }
  }

  async function deleteTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    dispatch({ type: TODO_ACTIONS.DELETE_TODO_START, payload: { id } });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (response.ok) {
        dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS });
        invalidateCache();
      } else {
        throw new Error('Failed to delete todo.');
      }
    } catch {
      dispatch({ type: TODO_ACTIONS.DELETE_TODO_ERROR, payload: originalTodo });
    }
  }
  
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <section className="space-y-6 rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Todos</h2>
          <p className="mt-1 text-slate-500">Add, organize, and complete your tasks.</p>
        </div>

      {error && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">
          <div>{error}</div>
          <button className="mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm font-bold text-white hover:bg-slate-700" onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>Clear Error</button>
        </div>
      )}

      {filterError && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">
          <p>{filterError}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded-md bg-slate-800 px-3 py-2 text-sm font-bold text-white hover:bg-slate-700" onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50" onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}>Reset Filters</button>
          </div>
        </div>
      )}
      
      {debouncedLoading && (
        <div className="rounded-md bg-slate-100 px-4 py-3 text-slate-600">
          Loading todos...
        </div>
      )}

        <div className="grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={(newSort) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy : newSort, sortDirection }})} onSortDirectionChange={(newDir) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection: newDir }})}/>
          <StatusFilter />
          <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
        </div>
        <TodoForm onAddTodo={addTodo} />
        <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} onDeleteTodo={deleteTodo} dataVersion={dataVersion} statusFilter={statusFilter}/>

      </section>
    </main>
  );
}

export default TodosPage;