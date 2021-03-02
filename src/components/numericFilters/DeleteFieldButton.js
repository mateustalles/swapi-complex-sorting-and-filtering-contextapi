import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';

export default function DeleteFieldButton({ filterIndex }) {
  const { filters: [filters, setFilters] } = useContext(PlanetsDBContext);

  const removeFilter = () => {
    const filteredFilters = filters.filter((filter, index) => {
      if ('numericValues' in filter && index === filterIndex + 1) return false;
      return filter;
    });
    return setFilters(filteredFilters);
  };

  return (
    <button
      data-testid={`remove-filter-button-${filterIndex}`}
      type="button"
      onClick={removeFilter}
      id="remove"
    >
      X
    </button>
  );
}

DeleteFieldButton.propTypes = {
  filterIndex: PropTypes.number.isRequired,
};
