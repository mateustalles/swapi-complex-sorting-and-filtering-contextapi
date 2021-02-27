import React, { useContext } from 'react';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';

export default function DeleteFieldButton(filterIndex, filter) {
  const { filters: [filters, setFilters] } = useContext(PlanetsDBContext);

  const numericFilters = filters.filter((eachFilter) => 'numericValues' in eachFilter);

  const removeFilterRow = () => numericFilters.length > 1 && setFilters(
    [...filters.filter((el, index) => index !== filters.indexOf(filter))],
  );

  return (
    <button
      data-testid={`remove-filter-button-${filterIndex}`}
      type="button"
      onClick={() => removeFilterRow()}
      id="remove"
    >
      X
    </button>
  );
}
