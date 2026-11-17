import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, onDeleteTodo, dataVersion, statusFilter = 'active', }) {
  
  const filteredTodoList = useMemo(() => {
      let filteredTodos;
      switch (statusFilter) {
        case 'completed':
          filteredTodos = todoList.filter((todo) => todo.isCompleted);
          break;
        case 'active':
          filteredTodos = todoList.filter((todo) => !todo.isCompleted);
          break;
        case 'all':
        default:
          filteredTodos = todoList;
          break;
      }
    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';
      case 'active':
        return 'No active todos. Add a todo above to get started.';
      case 'all':
      default:
        return 'Add todo above to get started.';
    }
  };

  return filteredTodoList.todos.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-[#ead9e0] bg-[#fdf9fb] px-6 py-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f9edf2] text-[#bd527c]" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path d="M8 5h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2h1Zm0 0a2 2 0 0 1 4 0M8 11h7M8 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="mt-4 font-extrabold text-[#44363d]">{getEmptyMessage()}</p>
    </div>
  ) : (
    <ul className="space-y-3">
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;