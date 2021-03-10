import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import useNumericFilters from './useNumericFilters';
import useNameFilter from './useNameFilter';
// import useSortFilters from './useSortFilters';

const filterByName = (planetName = null, planets) => {
  if (planetName) {
    const newNameFilter = `.*${planetName}.*`;
    const regExpFilter = new RegExp(newNameFilter, 'yi');
    return planets.filter(
      (planet) => planet.name.match(regExpFilter),
    );
  }
  return planets;
};

const filterByNumericValues = ({ column, value, comparison }, filteredPlanets) => {
  const comparator = (comparedColumn, comparedValue) => ({
    lesserThan: () => comparedColumn < comparedValue,
    equalsThan: () => comparedColumn === comparedValue,
    higherThan: () => comparedColumn > comparedValue,
  });

  return filteredPlanets.filter(
    (planet) => comparator(Number(planet[column]), Number(value))[comparison](),
  );
};

// const removeLastFilterRow = (filters, setFilters) => {
//   const poppedFilter = filters.pop();
//   setFilters(poppedFilter);
// };

// const sortColumns = (sortFilters, filteredPlanets) => {
//   const sortedPlanets = sortFilters.map(({ order, column }) => {
//     if (order === 'ASC') {
//       return filteredPlanets.sort(
//         (planetA, planetB) => (planetA[column] > planetB[column] ? 1 : -1),
//       );
//     }

//     return filteredPlanets.sort(
//       (planetA, planetB) => (planetA[column] < planetB[column] ? 1 : -1),
//     );
//   });

//   return sortedPlanets;
// };

export default function usePlanetsFiltering() {
  const {
    filters: [filters],
    data: [planetsData],
    planets: [, setFilteredPlanets],
    filterStatus: [filteringStatus],
  } = useContext(PlanetsDBContext);

  const planets = useRef(null);

  const numericFilters = useNumericFilters(filters);
  const nameFilter = useNameFilter(filters);
  // const sortFilters = useSortFilters(filters);
  const { name: isFilteringByName, numeric: isFilteringByNumber } = filteringStatus;

  // useEffect(() => {
  //   // console.log(state.filteredPlanets);
  //   if (filteringStatus.name === true) {
  //     console.log('filtered by sort');
  //     const sortedPlanets = sortColumns(sortFilters, filteredPlanets);
  //     setFilteredPlanets(sortedPlanets);
  //   }
  //   return () => {
  //   };
  // }, [sortFilters, filteredPlanets, prevRef, setFilteredPlanets]);

  useEffect(() => {
    const query = nameFilter['0'] ? nameFilter['0'].name : null;

    console.log('filtered by name');
    const planetsByName = filterByName(query, planetsData);
    setFilteredPlanets(planetsByName);
    planets.current = planetsByName;

    return () => {
      if (planetsData
        && !isFilteringByName
        && !isFilteringByNumber) setFilteredPlanets(planetsData);
    };
  }, [
    nameFilter, isFilteringByName, isFilteringByNumber,
    setFilteredPlanets, planetsData,
  ]);

  useEffect(() => {
    console.log('filtered by number');
    numericFilters.forEach(({ numericValues, numericValues: { column, comparison, value } }) => {
      console.log(column, comparison, value);
      if (column !== '' && comparison !== '' && value !== '') {
        const planetsByNumericData = filterByNumericValues(numericValues, planets.current);
        setFilteredPlanets(planetsByNumericData);
        // addFilterRow(numericFilters, filters, setFilters);
      }
    });

    return () => {
      if (planetsData
        && !isFilteringByNumber
        && !isFilteringByName) setFilteredPlanets(planetsData);
      // removeLastFilterRow(filters, setFilters);
    };
  }, [
    numericFilters, planetsData, filters,
    isFilteringByName, isFilteringByNumber, setFilteredPlanets,
  ]);

  return null;
}
