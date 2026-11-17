
function SortBy ({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
    return (
        <>
        <div>
            <label className="field-label" htmlFor="sortby-select">Sort by</label>
            <select
            id="sortby-select"
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}
            className="field-control">
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
            </select>
        </div>

        <div>
            <label className="field-label" htmlFor="order-select">Order</label>
            <select
            id="order-select"
            value={sortDirection}
            onChange={(event) => onSortDirectionChange(event.target.value)}
            className="field-control">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </div>
        </>
);
}

export default SortBy;