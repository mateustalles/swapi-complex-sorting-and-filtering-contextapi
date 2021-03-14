import {
  useContext,
  // useEffect,
  // useEffect,
  // useLayoutEffect,
  useState,
  useMemo,
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
  const { name: isFilteringByName, numeric: isFilteringByNumber } = filteringStatus;

  const [planetsFilteredByName, setPlanetsFilteredByName] = useState([]);
  const [planetsFilteredByNumber, setPlanetsFilteredByNumber] = useState([]);

  const previousFiltersState = useRef(numericFilters);

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

  const planets = useMemo(() => ({ current: planetsData }), [planetsData]);

  useEffect(() => {
    const query = nameFilter['0'] ? nameFilter['0'].name : null;
    if (query) {
      console.log('filtered by name');
      const planetsByName = filterByName(
        query, planetsData,
      );
      setPlanetsFilteredByName(planetsByName);
    } else if (!query || query === '') {
      setPlanetsFilteredByName(planets);
    }
  }, [
    nameFilter, isFilteringByName, isFilteringByNumber,
    planetsData, planets,
  ]);

  useEffect(() => {
    const filterRef = previousFiltersState.current.numericFilters;
    numericFilters.forEach((
      { numericValues, numericValues: { column, comparison, value } }, index,
    ) => {
      console.log(previousFiltersState);
      // console.log(filterRef[index] !== numericValues, filterRef[index], numericValues);
      if (column !== '' && comparison !== '' && value !== '' && filterRef[index] !== numericValues) {
        console.log('filtered by number');
        const planetsByNumericData = filterByNumericValues(numericValues, planetsData);
        previousFiltersState[index] = numericValues;
        setPlanetsFilteredByNumber(planetsByNumericData);
      }
    });
  }, [
    numericFilters, planetsData, filters,
    isFilteringByName, isFilteringByNumber,
  ]);

  const filterPlanets = () => {
    let filteredData = [];
    filteredData = planetsFilteredByName.length > 0
      ? planetsData.filter((planet) => planetsFilteredByName.includes(planet)) : planetsData;
    filteredData = planetsFilteredByNumber.length > 0
      ? filteredData.filter((planet) => planetsFilteredByNumber.includes(planet)) : filteredData;

    console.log(filteredData);
    return filteredData;
  };

  return filterPlanets();
}
