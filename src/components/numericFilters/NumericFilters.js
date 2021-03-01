import React, { useContext } from 'react';
import useNumericFilters from '../../hooks/useNumericFilters';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';
import ColumnsField from './ColumnsField';
import ComparisonField from './ComparisonField';
import DeleteFieldButton from './DeleteFieldButton';
import ValuesField from './ValuesField';

export default function NumericFilters() {
  const { filters: [filters, setFilters] } = useContext(PlanetsDBContext);
  const numericFilters = useNumericFilters(filters);

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
          {ColumnsField(numericFilters, filterIndex, column, updateFilters)}
          {ComparisonField(filterIndex, comparison, updateFilters)}
          {ValuesField(filterIndex, value, updateFilters)}
          {DeleteFieldButton(numericFilters, filterIndex)}
        </div>
      );
    })
  );
}
