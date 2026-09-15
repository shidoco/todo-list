import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../../utils/todoValidation';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {

  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isEditing) {
      return;
    }
    if (!isValidTodoTitle(workingTitle)) {
      return;
    }
    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });
    setIsEditing(false);
  };

  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
  };

  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todotitle${todo.id}`}
              labelText="Edit Todo: "
              value={workingTitle}
              onChange={handleEdit}
            />
            <button className="rounded-md border border-red-200 px-3 py-2 font-bold text-red-600 hover:bg-red-50"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button className="rounded-md border border-green-400 px-3 py-2 font-bold text-green-600 hover:bg-green-50"
              onClick={handleUpdate}
              type="submit"
              disabled={!isValidTodoTitle(workingTitle)}
            >
              Update
            </button>
          </>
        ) : (
          <>
            <label>
                <input className="accent-pink-500 h-5 w-5 "
                  type="checkbox"
                  id={`checkbox${todo.id}`}
                  checked={todo.isCompleted}
                  onChange={() => onCompleteTodo(todo.id)}
                />
            </label>
            <span className="todo-title min-w-0 flex-1 cursor-pointer text-slate-800" onClick={() => setIsEditing(true)}>{todo.title}</span>
            <button
              className="rounded-md border border-red-200 px-3 py-2 font-bold text-red-600 hover:bg-red-50"
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
            >
              Delete
            </button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;