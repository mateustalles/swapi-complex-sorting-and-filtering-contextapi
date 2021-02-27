import React, { useContext } from 'react';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';
import ColumnsField from './ColumnsField';
import ComparisonField from './ComparisonField';
import DeleteFieldButton from './DeleteFieldButton';
import ValuesField from './ValuesField';

export default function NumericFilters() {
  const { filters: [filters] } = useContext(PlanetsDBContext);

  const numericFilters = filters.filter((filter) => 'numericValues' in filter);

  return (
    numericFilters.map((filter, index) => {
      const {
        numericValues:
        { column, comparison, value },
      } = filter;

      const filterIndex = index;

      return (
        <div key={`row_${filterIndex + 1}`} data-testid={`filter-row-${filterIndex}`}>
          {ColumnsField(filterIndex, column)}
          {ComparisonField(filterIndex, comparison)}
          {ValuesField(filterIndex, value)}
          {DeleteFieldButton(filterIndex, filter)}
        </div>
      );
    })
  );
}
