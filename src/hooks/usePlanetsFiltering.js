import {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import useNumericFilters from './useNumericFilters';
import useNameFilter from './useNameFilter';
import useSortFilters from './useSortFilters';

const filterByName = (nameFilter, filteredPlanets) => {
  if (nameFilter.name !== '') {
    const newNameFilter = `.*${nameFilter}.*`;
    const regExpFilter = new RegExp(newNameFilter, 'yi');
    return filteredPlanets.filter(
      (planet) => planet.name.match(regExpFilter),
    );
  }
  return filteredPlanets;
};

const filterByNumericValues = (filteredPlanets, { column, value, comparison }) => {
  const comparator = (comparedColumn, comparedValue) => ({
    lesserThan: () => comparedColumn < comparedValue,
    equalsThan: () => comparedColumn === comparedValue,
    higherThan: () => comparedColumn > comparedValue,
  });

  return filteredPlanets.filter(
    (planet) => comparator(Number(planet[column]), Number(value))[comparison](),
  );
};

// const addFilterRow = (numericFilters, filters, setFilters) => {
//   if (numericFilters.length < 5) {
//     setFilters([...filters, { numericValues: { column: '', comparison: '', value: '' } }]);
//   }
// };

// const removeLastFilterRow = (filters, setFilters) => {
//   const poppedFilter = filters.pop();
//   setFilters(poppedFilter);
// };

const sortColumns = (sortFilters, filteredPlanets) => {
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
  const [filteredPlanets, setFilteredPlanets] = useState(planetsData);

  const previousValues = useRef({ numericFilters, nameFilter, sortFilters });

  useEffect(() => {
    const prevRef = previousValues.current;

    if (previousValues.current.sortFilters !== sortFilters) {
      const sortedPlanets = sortColumns(sortFilters, filteredPlanets);
      setFilteredPlanets(sortedPlanets);
      previousValues.current.sortFilters = sortFilters;
    }

    return () => {
      setFilteredPlanets(planetsData);
      previousValues.current = prevRef;
    };
  }, [planetsData, filteredPlanets, sortFilters]);

  useEffect(() => {
    const prevRef = previousValues.current;

    if (previousValues.current.nameFilter !== nameFilter) {
      const planetsByName = filterByName(nameFilter, filteredPlanets);
      setFilteredPlanets(planetsByName);
      previousValues.current.nameFilter = nameFilter;
    }

    return () => {
      setFilteredPlanets(planetsData);
      previousValues.current = prevRef;
    };
  }, [planetsData, filteredPlanets, nameFilter]);

  useEffect(() => {
    const prevRef = previousValues.current;

    if (previousValues.current.numericFilters !== numericFilters) {
      numericFilters.forEach(({ numericValues, numericValues: { column, comparison, value } }) => {
        if (column !== '' && comparison !== '' && value !== '') {
          const planetsByNumericData = filterByNumericValues(filteredPlanets, numericValues);
          setFilteredPlanets(planetsByNumericData);
          // addFilterRow(numericFilters, filters, setFilters);
        }
      });
      previousValues.current.numericFilters = numericFilters;
    }
    return () => {
      setFilteredPlanets(planetsData);
      previousValues.current = prevRef;
      // removeLastFilterRow(filters, setFilters);
    };
  }, [filters, numericFilters, setFilters, filteredPlanets, planetsData]);

  return filteredPlanets;
}
