import React, { useContext } from 'react';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';

export default function ColumnsField(filterIndex, selectedCol) {
  const { filters: [filters, , addNewFilter] } = useContext(PlanetsDBContext);

  const selectors = [
    ['population', 'Population'],
    ['orbital_period', 'Orbital period'],
    ['diameter', 'Diameter'],
    ['rotation_period', 'Rotation period'],
    ['surface_water', 'Surface water'],
  ];

  const usedColumns = filters.map(
    (filter) => 'numericValues' in filter && filter.numericValues.column,
  );

  const availableSelectors = selectors.filter(
    (selector) => (
      !(usedColumns.includes(selector[0])) || selector[0] === selectedCol),
  );

  return (
    <select
      data-testid={`column-selector-${filterIndex}`}
      onChange={(e) => addNewFilter(e, filterIndex)}
      id="column"
      value={selectedCol}
    >
      <option value="" disabled selected>Select parameter</option>
      {availableSelectors.map(
        ([value, label]) => (
          <option
            key={`${label}_selector`}
            value={value}
            data-testid={`column-${value}-${filterIndex}`}
          >
            {label}
          </option>
        ),
      )}
    </select>
  );
}
