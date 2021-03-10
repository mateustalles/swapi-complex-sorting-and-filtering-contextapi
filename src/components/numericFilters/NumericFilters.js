import React, { useContext, useEffect } from 'react';
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
  useEffect(() => {
    const addFilterRow = () => {
      setFilters(
        (filterSet) => filterSet.map((filter, index) => {
          if (index === 1) {
            return {
              numericFilters: [
                ...filter.numericFilters, {
                  numericValues: { column: '', comparison: '', value: '' },
                },
              ],
            };
          }
          return filter;
        }),
      );
    };

    if (numericFilters.length < 5) {
      numericFilters.forEach(({ numericValues: { column, comparison, value } },
        filterIndex) => {
        if (column && comparison && value && filterIndex === numericFilters.length - 1) {
          return addFilterRow();
        }
        return null;
      });
    }
  }, [numericFilters, setFilters]);

  const updateFilters = (e, filterIndex) => {
    let isFilteringByNumbers = false;
    const filteredFilters = [];

    numericFilters.forEach((filter, index) => {
      const { numericValues: { column, comparison, value } } = filter;
      if (column && comparison && value) isFilteringByNumbers = true;

      if (index === filterIndex) {
        return filteredFilters.push({
          numericValues:
            { ...filter.numericValues, [e.target.id]: e.target.value },
        });
      }
      return filteredFilters.push(filter);
    });

    setFilteringStatus((status) => ({ ...status, numeric: isFilteringByNumbers }));

    setFilters(
      (filterSet) => filterSet.map((filter, index) => {
        if (index === 1) return { numericFilters: [...filteredFilters] };
        return filter;
      }),
    );
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
