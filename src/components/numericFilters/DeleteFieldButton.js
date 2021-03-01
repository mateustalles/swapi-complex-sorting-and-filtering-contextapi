import React, { useContext } from 'react';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';

export default function DeleteFieldButton(numericFilters, filterIndex) {
  const { filters: [filters, setFilters] } = useContext(PlanetsDBContext);

  const removeFilterRow = () => numericFilters.length > 1
    && setFilters(
      [...filters.filter((el, index) => index !== filterIndex + 1)],
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
