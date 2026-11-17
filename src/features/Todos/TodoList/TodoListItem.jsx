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
    <li className={`rounded-2xl border border-[#efe5e9] bg-white p-4 transition hover:border-[#e6cbd6] hover:shadow-[0_8px_24px_rgba(85,49,66,0.07)] ${todo.isCompleted ? 'bg-[#fdf9fb]' : ''}`}>
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todotitle${todo.id}`}
              labelText="Edit Todo: "
              value={workingTitle}
              onChange={handleEdit}
            />
            <button className="secondary-button"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button className="primary-button"
              onClick={handleUpdate}
              type="submit"
              disabled={!isValidTodoTitle(workingTitle)}
            >
              Update
            </button>
          </>
        ) : (
          <>
            <label className="grid h-6 w-6 shrink-0 place-items-center">
                <input className="h-[1.15rem] w-[1.15rem] cursor-pointer accent-[#bd527c]"
                  type="checkbox"
                  id={`checkbox${todo.id}`}
                  checked={todo.isCompleted}
                  aria-label={`Mark "${todo.title}" ${todo.isCompleted ? 'active' : 'complete'}`}
                  onChange={() => onCompleteTodo(todo.id)}
                />
            </label>
            <button
              type="button"
              className={`min-w-0 flex-1 text-left font-bold leading-6 ${todo.isCompleted ? 'text-[#a99da3] line-through' : 'text-[#44363d]'}`}
              onClick={() => setIsEditing(true)}
              aria-label={`Edit "${todo.title}"`}
            >
              {todo.title}
            </button>
            <button
              className="danger-button"
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