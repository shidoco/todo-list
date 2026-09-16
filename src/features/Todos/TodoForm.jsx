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
        <form onSubmit={handleAddTodo} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <TextInputWithLabel
            elementId="todoTitle"
            labelText="Todo"
            ref={inputRef}
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
        <button type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
        className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">Add Todo
        </button>
        </form>
    );
}

export default TodoForm;