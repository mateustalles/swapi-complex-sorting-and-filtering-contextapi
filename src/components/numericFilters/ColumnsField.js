import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';

export default function ColumnsField({
  numericFilters, filterIndex, column, updateFilters,
}) {
  const { selectors: [selectors, setSelectors] } = useContext(PlanetsDBContext);

  const usedColumns = numericFilters.map((filter) => filter.numericValues.column);

  const availableSelectors = selectors.filter((selector) => (
    !usedColumns.includes(selector[0]) || selector[0] === column
  ));

  return (
    <select
      data-testid={`column-selector-${filterIndex}`}
      onChange={(e) => {
        updateFilters(e, filterIndex);
        setSelectors(selectors.filter((selector) => !selector.includes(column)));
      }}
      id="column"
      value={column}
    >
      <option value="" disabled defaultValue>Select parameter</option>
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

ColumnsField.propTypes = {
  numericFilters: PropTypes.arrayOf(Object).isRequired,
  filterIndex: PropTypes.number.isRequired,
  column: PropTypes.string.isRequired,
  updateFilters: PropTypes.func.isRequired,
};
