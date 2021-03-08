import React, { useContext } from 'react';
import useNumericFilters from '../../hooks/useNumericFilters';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';
import ColumnsField from './ColumnsField';
import ComparisonField from './ComparisonField';
import DeleteFieldButton from './DeleteFieldButton';
import ValuesField from './ValuesField';

export default function NumericFilters() {
  const {
    filters: [filters, setFilters],
    filterStatus: [, setFilteringStatus],
  } = useContext(PlanetsDBContext);

  const numericFilters = useNumericFilters(filters);

  const isFilteringByNumbers = (filterSet) => {
    const { numericValues: { column, comparison, value } } = filterSet[1];
    if (column && comparison && value) {
      return setFilteringStatus((status) => ({ ...status, numeric: true }));
    }
    return setFilteringStatus((status) => ({ ...status, numeric: false }));
  };

  const updateFilters = (e, filterIndex) => {
    const filteredFilters = filters.map((filter, index) => {
      if ('numericValues' in filter && index === filterIndex + 1) {
        return {
          numericValues:
            { ...filter.numericValues, [e.target.id]: e.target.value },
        };
      }
      return filter;
    });
    console.log(filteredFilters);
    isFilteringByNumbers(filteredFilters);
    return setFilters(filteredFilters);
  };

  return (
    numericFilters.map((filter, index) => {
      const {
        numericValues:
        { column, comparison, value },
      } = filter;

      const filterIndex = index;

      return (
        <div key={`row_${filterIndex}`} data-testid={`filter-row-${filterIndex}`}>
          <ColumnsField
            numericFilters={numericFilters}
            filterIndex={filterIndex}
            column={column}
            updateFilters={updateFilters}
          />
          <ComparisonField
            filterIndex={filterIndex}
            comparison={comparison}
            updateFilters={updateFilters}
          />
          <ValuesField
            filterIndex={filterIndex}
            value={value}
            updateFilters={updateFilters}
          />
          <DeleteFieldButton filterIndex={filterIndex} />
        </div>
      );
    })
  );
}
