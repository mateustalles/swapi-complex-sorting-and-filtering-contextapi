import { useContext } from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import useNumericFilters from './useNumericFilters';
import useNameFilter from './useNameFilter';
import useSortFilters from './useSortFilters';

const filterByName = (nameFilter, newFilteredPlanets) => {
  const newNameFilter = `.*${nameFilter}.*`;
  const regExpFilter = new RegExp(newNameFilter, 'yi');
  return newFilteredPlanets.filter(
    (planet) => planet.name.match(regExpFilter),
  );
};

const filterByNumericValues = (newFilteredPlanets, { column, value, comparison }) => {
  const columnComparison = (comparedColumn, comparedValue) => ({
    lesserThan: () => comparedColumn < comparedValue,
    equalsThan: () => comparedColumn === comparedValue,
    higherThan: () => comparedColumn > comparedValue,
  });

  return newFilteredPlanets.filter(
    (planet) => columnComparison(Number(planet[column]), Number(value))[comparison](),
  );
};

const updateFiltersRow = (filters, setFilters) => {
  const numericFilters = filters.filter((filter) => 'numericValues' in filter);
  const lastFilter = numericFilters[numericFilters.length - 1];
  const { numericValues: { column, comparison, value } } = lastFilter;
  if (column !== '' && comparison !== '' && value !== '' && numericFilters.length < 5) {
    setFilters([...filters, { numericValues: { column: '', comparison: '', value: '' } }]);
  }
};

const sortColumns = (filteredPlanets, sortFilters) => {
  const sortedPlanets = sortFilters.map(({ order, column }) => {
    if (order === 'ASC') {
      return filteredPlanets.sort(
        (planetA, planetB) => (planetA[column] > planetB[column] ? 1 : -1),
      );
    }

    return filteredPlanets.sort(
      (planetA, planetB) => (planetA[column] < planetB[column] ? 1 : -1),
    );
  });

  return sortedPlanets;
};

export default function usePlanetsFiltering(planetsData) {
  const { filters: [filters, setFilters] } = useContext(PlanetsDBContext);
  const numericFilters = useNumericFilters(filters);
  const nameFilter = useNameFilter(filters);
  const sortFilters = useSortFilters(filters);

  let filteredPlanets = planetsData;

  filteredPlanets = sortColumns(filteredPlanets, sortFilters);

  filters.forEach((filter) => {
    if ('name' in filter && filter.name !== '') {
      filteredPlanets = filterByName(filters[0].name, filteredPlanets);
    }
  });

  numericFilters.map(({ numericValues, numericValues: { column, comparison, value } }) => {
    if (numericValues && column !== '' && comparison !== '' && value !== '') {
      filteredPlanets = filterByNumericValues(filteredPlanets, numericValues);
      updateFiltersRow(filters, setFilters);
    }
    return { ...numericValues };
  });

  return filteredPlanets;
}
