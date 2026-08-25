function FilterInput({filterTerm, onFilterChange}) {
    return(
        <div>
            <label htmlFor='filterinput'>Search todos:</label>
            <input
            id='filterinput'
            type='text'
            value={filterTerm}
            onChange={(event) => onFilterChange(event.target.value)}
            placeholder='Search by title...'></input>
        </div>
    )
}

export default FilterInput;