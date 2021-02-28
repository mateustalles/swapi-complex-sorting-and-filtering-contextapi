import { useContext } from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';

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

const sortColumns = (filteredPlanets, filters) => {
  const sortValue = (value) => {
    const noUnknownValue = value === 'unknown' ? 99999999999999999999 : value;
    return String(noUnknownValue).match(/[aA-zZ]/g) ? String(noUnknownValue) : Number(noUnknownValue);
  };

  let sortedPlanets = [];
  filters.forEach(({ order, column }) => {
    if (order && order === 'ASC') {
      sortedPlanets = filteredPlanets.sort(
        (planetA, planetB) => (sortValue(planetA[column]) > sortValue(planetB[column]) ? 1 : -1),
      );
    }
    if (order && order === 'DESC') {
      sortedPlanets = filteredPlanets.sort(
        (planetA, planetB) => sortValue((planetA[column]) < sortValue(planetB[column]) ? 1 : -1),
      );
    }
    sortedPlanets = filteredPlanets;
  });
  return sortedPlanets;
};

export default function usePlanetsFiltering() {
  const {
    filters: [filters, setFilters], data: [planetsData],
  } = useContext(PlanetsDBContext);

  let newFilteredPlanets = planetsData;

  newFilteredPlanets = sortColumns(newFilteredPlanets, filters);

  const numericFilters = filters.filter((filter) => 'numericValues' in filter);

  filters.forEach((filter) => {
    if ('name' in filter && filter.name !== '') {
      newFilteredPlanets = filterByName(filters[0].name, newFilteredPlanets);
    }
  });

  numericFilters.map(({ numericValues, numericValues: { column, comparison, value } }) => {
    if (numericValues && column !== '' && comparison !== '' && value !== '') {
      newFilteredPlanets = filterByNumericValues(newFilteredPlanets, numericValues);
      updateFiltersRow(filters, setFilters);
    }
    return { ...numericValues };
  });

  return newFilteredPlanets;
}
