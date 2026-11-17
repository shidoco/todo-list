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
            labelText="Add a task"
            ref={inputRef}
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />
        <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)} className="primary-button sm:mb-0">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add task
        </button>
        </form>
    );
}

export default TodoForm;