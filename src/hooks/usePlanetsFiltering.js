import {
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import useNumericFilters from './useNumericFilters';
import useNameFilter from './useNameFilter';
// import useSortFilters from './useSortFilters';

const filterByName = (planetName = null, planets) => {
  if (planetName && planets) {
    const newNameFilter = `.*${planetName}.*`;
    const regExpFilter = new RegExp(newNameFilter, 'gyi');
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

export default function usePlanetsFiltering(planetsData) {
  const {
    filters: [filters],
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
      const planetsByName = filterByName(
        query, planetsData,
      );
      setPlanetsFilteredByName(new Set(planetsByName));
    }
  }, [
    nameFilter, planetsData,
  ]);

  useEffect(() => {
    const filterRef = previousFiltersState.current.numericFilters;
    let filteredData = planetsData;
    numericFilters.forEach((
      { numericValues, numericValues: { column, comparison, value } }, index,
    ) => {
      if (column !== '' && comparison !== '' && value !== '' && filterRef[index] !== numericValues) {
        const planetsByNumericData = filterByNumericValues(numericValues, filteredData);
        filteredData = planetsByNumericData;
      }
      previousFiltersState.current[index] = numericValues;
    });
    setPlanetsFilteredByNumber(new Set(filteredData));
  }, [
    numericFilters, planetsData, filters,
  ]);

  const filterPlanets = () => {
    let planetsIntersection;
    if (isFilteringByName && !isFilteringByNumber) {
      planetsIntersection = new Set([...planetsFilteredByName]);
    } else if (isFilteringByNumber && !isFilteringByName) {
      planetsIntersection = new Set([...planetsFilteredByNumber]);
    } else if (isFilteringByName && isFilteringByNumber) {
      planetsIntersection = new Set([...planetsData]
        .filter((planet) => planetsFilteredByName.has(planet))
        .filter((planet) => planetsFilteredByNumber.has(planet)));
    } else {
      planetsIntersection = new Set([...planetsData]);
    }
    return [...planetsIntersection];
  };

  return filterPlanets();
}
