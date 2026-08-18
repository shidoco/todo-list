import { useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../utils/todoValidation';

function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const inputRef = useRef();

    const handleAddTodo = (event) => {
        event.preventDefault();

        const todoTitle = workingTodoTitle.trim();
        if (todoTitle) {
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle('');
        }
    };

    return (
        <form onSubmit={handleAddTodo}>
        <TextInputWithLabel
            elementId="todoTitle"
            labelText="Todo"
            ref={inputRef}
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
        <button type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo
        </button>
        </form>
    );
}

export default TodoForm;