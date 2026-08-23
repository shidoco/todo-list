import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../../utils/todoValidation';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {

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
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todotitle${todo.id}`}
              labelText="Edit Todo: "
              value={workingTitle}
              onChange={handleEdit}
            />
            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type = "button"
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
                <input
                  type="checkbox"
                  id={`checkbox${todo.id}`}
                  checked={todo.isCompleted}
                  onChange={() => onCompleteTodo(todo.id)}
                />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;