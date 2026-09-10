import React from 'react';

function SortBy ({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
    return (
        <>
        <div>
            <label htmlFor="sortby-select">Sort By</label>
            <select
            id="sortby-select"
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}>
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
            </select>
        </div>

        <div>
            <label htmlFor="order-select">Order</label>
            <select
            id="order-select"
            value={sortDirection}
            onChange={(event) => onSortDirectionChange(event.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </div>
        </>
);
}

export default SortBy;