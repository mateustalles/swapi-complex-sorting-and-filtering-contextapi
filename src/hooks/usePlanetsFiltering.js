import {
  useContext,
  useEffect,
  useRef,
  // useReducer,
} from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import useNumericFilters from './useNumericFilters';
import useNameFilter from './useNameFilter';
// import useSortFilters from './useSortFilters';

const filterByName = ([{ name: planetName }], planets) => {
  if (planetName !== '') {
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

// const addFilterRow = (numericFilters, filters, setFilters) => {
//   if (numericFilters.length < 5) {
//     setFilters([...filters, { numericValues: { column: '', comparison: '', value: '' } }]);
//   }
// };

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
    planets: [filteredPlanets, setFilteredPlanets],
    filterStatus: [filteringStatus],
  } = useContext(PlanetsDBContext);

  // console.log(filteredPlanets);
  const numericFilters = useNumericFilters(filters);
  const nameFilter = useNameFilter(filters);
  // const sortFilters = useSortFilters(filters);
  const { name: isFilteringByName, number: isFilteringByNumber } = filteringStatus;

  // function planetsReducer(state, action) {
  //   switch (action.type) {
  //     case 'filter':
  //       return { filteredPlanets: action.payload };
  //     case 'restore':
  //       return { filteredPlanets: action.payload };
  //     default:
  //       throw new Error();
  //   }
  // }
  // const [state, dispatch] = useReducer(planetsReducer, { filteredPlanets: planetsData });

  const previousValues = useRef({
    // filteredPlanets: state.filteredPlanets,
    prevNameFilter: nameFilter || { name: '' },
  });

  // const dataHasPlanets = state.filteredPlanets && state.filteredPlanets.length > 0;

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
    const prevRef = previousValues.current;
    const { prevNameFilter } = prevRef;

    if (isFilteringByName && '0' in prevNameFilter && prevNameFilter !== nameFilter) {
      console.log('filtered by name');
      const planetsByName = filterByName(nameFilter, planetsData);
      setFilteredPlanets(planetsByName);
    } else {
      setFilteredPlanets(planetsData);
    }

    prevRef.prevNameFilter = nameFilter;

    return () => {

    };
  }, [nameFilter, isFilteringByName, planetsData, setFilteredPlanets]);

  useEffect(() => {
    if (isFilteringByNumber) {
      console.log('filtered by number');
      numericFilters.forEach(({ numericValues, numericValues: { column, comparison, value } }) => {
        if (column !== '' && comparison !== '' && value !== '') {
          const planetsByNumericData = filterByNumericValues(numericValues, filteredPlanets);
          setFilteredPlanets(planetsByNumericData);
          // addFilterRow(numericFilters, filters, setFilters);
        }
      });
    }
    return () => {
      // removeLastFilterRow(filters, setFilters);
    };
  }, [numericFilters, filteredPlanets, isFilteringByNumber, setFilteredPlanets]);

  return null;
}
