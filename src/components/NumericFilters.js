import React, { useContext } from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';

function renderColumnsOptions(filterIndex, actualColumn, filters, setFilter) {
  const selectors = [
    ['', '   '],
    ['population', 'Population'],
    ['orbital_period', 'Orbital period'],
    ['diameter', 'Diameter'],
    ['rotation_period', 'Rotation period'],
    ['surface_water', 'Surface water'],
  ];

  const usedColumns = filters.map((filter) => 'numericValues' in filter && filter.numericValues.column);

  const availableSelectors = selectors.filter((selector) => (
    selector[0] === '' || !(usedColumns.includes(selector[0])) || selector[0] === actualColumn));

  return (
    <select
      data-testid={`column-selector-${filterIndex}`}
      onChange={(e) => setFilter(e, filterIndex)}
      id="column"
      value={actualColumn}
    >
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

function renderComparisonOptions(filterIndex, actualComparison, setFilter) {
  return (
    <select
      data-testid={`comparison-selector-${filterIndex}`}
      onChange={(e) => setFilter(e, filterIndex)}
      id="comparison"
      value={actualComparison}
    >
      <option data-testid={`null-comparison-${filterIndex}`} label=" " value="" defaultValue />
      <option data-testid={`lesserThan-comparison-${filterIndex}`} value="lesserThan">{'<'}</option>
      <option data-testid={`equalsThan-comparison-${filterIndex}`} value="equalsThan">=</option>
      <option data-testid={`higherThan-comparison-${filterIndex}`} value="higherThan">{'>'}</option>
    </select>

  );
}

function renderNumberInput(filterIndex, actualValue, setFilter) {
  return (
    <input
      data-testid={`value-selector-${filterIndex}`}
      onChange={(e) => setFilter(e, filterIndex)}
      type="number"
      id="value"
      width="100px"
      value={actualValue}
    />
  );
}

function renderRemoveButton(filterIndex, filter, filters, setFilters) {
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

export default function NumericFilters() {
  const { filters: [filters, setFilters] } = useContext(PlanetsDBContext);
  const numericFilters = filters.filter((filter) => 'numericValues' in filter);

  const setFilter = (event, filterIndex) => setFilters(
    filters.map((filter) => {
      if ('numericValues' in filter && numericFilters.indexOf(filter) === filterIndex) {
        return {
          numericValues:
          { ...filter.numericValues, [event.target.id]: event.target.value },
        };
      }
      return filter;
    }),
  );

  return (
    numericFilters.map((filter, index) => {
      const {
        numericValues:
        { column: actualColumn, comparison: actualComparison, value: actualValue },
      } = filter;
      const filterIndex = index;
      return (
        <div key={`row_${filterIndex + 1}`} data-testid={`filter-row-${filterIndex}`}>
          {renderColumnsOptions(filterIndex, actualColumn, filters, setFilter)}
          {renderComparisonOptions(filterIndex, actualComparison, setFilter)}
          {renderNumberInput(filterIndex, actualValue, setFilter)}
          {renderRemoveButton(filterIndex, filter, filters, setFilters)}
        </div>
      );
    })
  );
}
