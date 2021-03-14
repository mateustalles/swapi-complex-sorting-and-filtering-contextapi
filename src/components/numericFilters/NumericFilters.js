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
        (filterSet) => filterSet.map((filter) => {
          if ('numericFilters' in filter) {
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

  const checkFilteringStatus = (filteredFilters) => {
    let isFilteringByNumbers = false;
    const { numericValues: { column, comparison, value } } = filteredFilters[0];
    if (column && comparison && value) isFilteringByNumbers = true;
    setFilteringStatus((status) => ({ ...status, numeric: isFilteringByNumbers }));
  };

  const updateFilters = (e, filterIndex) => {
    const filteredFilters = [];

    numericFilters.forEach((filter, index) => {
      const { numericValues } = filter;
      if (index === filterIndex) {
        return filteredFilters.push({
          numericValues:
            { ...numericValues, [e.target.id]: e.target.value },
        });
      }
      return filteredFilters.push(filter);
    });

    checkFilteringStatus(filteredFilters);

    setFilters(
      (filterSet) => filterSet.map((filter) => {
        if ('numericFilters' in filter) return { numericFilters: [...filteredFilters] };
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
