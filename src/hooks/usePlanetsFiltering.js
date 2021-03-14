import {
  useContext,
  // useEffect,
  // useEffect,
  // useLayoutEffect,
  useState,
  // useMemo,
  useRef,
  useEffect,
} from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import useNumericFilters from './useNumericFilters';
import useNameFilter from './useNameFilter';
// import useSortFilters from './useSortFilters';

const filterByName = (planetName = null, planets) => {
  console.log(planetName, planets);
  if (planetName && planets) {
    const newNameFilter = `.*${planetName}.*`;
    const regExpFilter = new RegExp(newNameFilter, 'yi');
    const filteredPlanets = planets.filter(
      (planet) => planet.name.match(regExpFilter),
    );
    return filteredPlanets;
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
    filterStatus: [filteringStatus],
  } = useContext(PlanetsDBContext);
  const numericFilters = useNumericFilters(filters);
  const nameFilter = useNameFilter(filters);
  const [planetsFilteredByName, setPlanetsFilteredByName] = useState(new Set());
  const [planetsFilteredByNumber, setPlanetsFilteredByNumber] = useState(new Set());
  const { name: isFilteringByName, numeric: isFilteringByNumber } = filteringStatus;
  const previousFiltersState = useRef({ numericFilters });

  // const sortFilters = useSortFilters(filters);
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
    if (query) {
      console.log('filtered by name');
      const planetsByName = filterByName(
        query, planetsData,
      );
      setPlanetsFilteredByName(new Set(planetsByName));
    } else if (!query || query === '') {
      setPlanetsFilteredByName(new Set(planetsData));
    }
  }, [
    nameFilter, isFilteringByName, isFilteringByNumber, planetsData,
  ]);

  useEffect(() => {
    const filterRef = previousFiltersState.current.numericFilters;
    let filteredData = planetsData;
    numericFilters.forEach((
      { numericValues, numericValues: { column, comparison, value } }, index,
    ) => {
      if (column !== '' && comparison !== '' && value !== '' && filterRef[index] !== numericValues) {
        console.log('filtered by number');
        const planetsByNumericData = filterByNumericValues(numericValues, filteredData);
        filteredData = planetsByNumericData;
      }
      previousFiltersState.current[index] = numericValues;
    });
    setPlanetsFilteredByNumber(new Set(filteredData));
  }, [
    numericFilters, planetsData, filters,
    isFilteringByName, isFilteringByNumber,
  ]);

  const filterPlanets = () => {
    const planetsIntersection = new Set([...planetsFilteredByName]
      .filter((planet) => planetsFilteredByNumber.has(planet)));

    console.log(planetsIntersection);
    return [...planetsIntersection];
  };

  return (isFilteringByName || isFilteringByNumber) ? filterPlanets() : planetsData;
}
