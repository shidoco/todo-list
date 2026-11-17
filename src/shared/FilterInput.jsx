function FilterInput({filterTerm, onFilterChange}) {
    return(
        <div className="sm:col-span-2 lg:col-span-1">
            <label className="field-label" htmlFor='filterInput'>Search tasks</label>
            <input
            id='filterInput'
            type='text'
            value={filterTerm || ''}
            onChange={(event) => onFilterChange(event.target.value)}
            placeholder='Search by title...'
            className="field-control"></input>
        </div>
    )
}

export default FilterInput;