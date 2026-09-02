export const TODO_ACTIONS = {
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    COMPLETE_TODO_START: 'COMPLETE_TODO_START',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
    COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

    UPDATE_TODO_START: 'UPDATE_TODO_START',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
    RESET_FILTERS: 'RESET_FILTERS',
    CLEAR_DATAVERSION: 'CLEAR_DATAVERSION',
};

export const initialTodoState = {
    todoList: [],
    error: '',
    filterError: '',
    isTodoListLoading: true,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    filterTerm: '',
    dataVersion: 0,
};

export function todoReducer(state, action) {
    switch(action.type) {
        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                error: '',
                filterError: '',
                isTodoListLoading: true,
            };
        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                todoList: action.payload,
                error: '',
                filterError: '',
                isTodoListLoading: false,
            };
        case TODO_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                error: 'There was an error fetching todos.',
                isTodoListLoading: false,
            }
        case TODO_ACTIONS.ADD_TODO_START:
            return {
                ...state,
                todoList: [...state.todoList, action.payload],
                error: '',
            };

        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload.id ? action.payload : todo),
                error: '',
                isTodoListLoading: false,
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.ADD_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.filter((todo) => todo.id !== action.payload),
                error: 'Failed to add todo.',
            };
        case TODO_ACTIONS.COMPLETE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload ? {...todo, isCompleted: true} : todo),
                error: '',
            };
        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload.id ? action.payload : todo),
                error: '',
                dataVersion: state.dataVersion + 1,
            };
        case TODO_ACTIONS.COMPLETE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload ? {...todo, isCompleted: false} : todo),
                error: 'Failed to complete todo.',
            };
        case TODO_ACTIONS.UPDATE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                todo.id === action.payload.id ? action.payload : todo),
            };
        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload.id ? action.payload : todo),
                error: '',
                dataVersion : state.dataVersion + 1,
            };
        case TODO_ACTIONS.UPDATE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload.id ? action.payload : todo),
                error: 'Failed to update todo.',
            };
        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.payload.sortBy,
                sortDirection: action.payload.sortDirection,
                dataVersion: state.dataVersion + 1,
            };
        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterError: '',
                filterTerm: action.payload,
            };
        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: '',
            };
        case TODO_ACTIONS.CLEAR_FILTER_ERROR:
            return {
                ...state,
                filterError: '',
            }
        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                sortBy: 'createdAt',
                sortDirection: 'desc',
                filterTerm: '',
            }
        default:
            throw new Error (`Unknown action type: ${action.type}`);
    }
}