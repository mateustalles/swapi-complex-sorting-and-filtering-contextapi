import {
  useContext,
  useEffect,
  useMemo,
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
    planets: [, setFilteredPlanets],
    filterStatus: [filteringStatus],
  } = useContext(PlanetsDBContext);

  const numericFilters = useNumericFilters(filters);
  const nameFilter = useNameFilter(filters);
  const { name: isFilteringByName, numeric: isFilteringByNumber } = filteringStatus;

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
    let planetsByName = [];
    if (query) {
      console.log('filtered by name');
      planetsByName = filterByName(
        query, planetsData,
      );
      if (isFilteringByNumber) {
        planetsByName = planetsByName.filter((planet) => planets.current.includes(planet));
      }
      planets.current = planetsByName;
    } else {
      planetsByName = planetsData;
      planets.current = planetsByName;
    }

    return () => {
      if (planetsData
        && !isFilteringByName
        && !isFilteringByNumber) setFilteredPlanets(planetsData);
    };
  }, [
    nameFilter, isFilteringByName, isFilteringByNumber,
    setFilteredPlanets, planetsData, planets,
  ]);

  useEffect(() => {
    console.log('filtered by number');
    numericFilters.forEach(({ numericValues, numericValues: { column, comparison, value } }) => {
      console.log(column, comparison, value);
      if (column !== '' && comparison !== '' && value !== '') {
        const planetsByNumericData = filterByNumericValues(numericValues, planets.current);
        planets.current = planetsByNumericData;
      }
    });

    setFilteredPlanets(planets.current);
    return () => {
      if (planetsData
        && !isFilteringByNumber
        && !isFilteringByName) setFilteredPlanets(planetsData);
    };
  }, [
    numericFilters, planetsData, filters, planets,
    isFilteringByName, isFilteringByNumber, setFilteredPlanets,
  ]);
}
