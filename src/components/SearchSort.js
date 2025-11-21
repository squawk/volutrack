import React from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchSort.css';

/**
 * Search and Sort controls component
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Search change handler
 * @param {string} props.sortBy - Current sort option
 * @param {Function} props.onSortChange - Sort change handler
 * @param {React.RefObject} props.searchInputRef - Ref for the search input element
 */
const SearchSort = React.memo(({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  searchInputRef
}) => {
  return (
    <div className="search-sort-container">
      <div className="search-wrapper">
        <FiSearch className="search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Search guests..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search guests"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>
      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort guests"
      >
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="status-confirmed">Confirmed First</option>
        <option value="status-pending">Pending First</option>
        <option value="recent">Recently Added</option>
      </select>
    </div>
  );
});

SearchSort.displayName = 'SearchSort';

SearchSort.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object
};

export default SearchSort;
