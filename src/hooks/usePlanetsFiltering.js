import {
  useContext,
  useEffect,
  useRef,
  useReducer,
} from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import useNumericFilters from './useNumericFilters';
import useNameFilter from './useNameFilter';
import useSortFilters from './useSortFilters';

const filterByName = (nameFilter, filteredPlanets, setFilteredPlanets) => {
  if (nameFilter !== '') {
    const newNameFilter = `.*${nameFilter}.*`;
    const regExpFilter = new RegExp(newNameFilter, 'yi');
    console.log(nameFilter);
    return setFilteredPlanets(filteredPlanets.filter(
      (planet) => planet.name.match(regExpFilter),
    ));
  }
  return setFilteredPlanets(filteredPlanets);
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

export default function usePlanetsFiltering() {
  const {
    filters: [filters],
    // data: [planetsData],
    filtered: [filteredPlanets, setfilteredPlanets],
  } = useContext(PlanetsDBContext);
  const numericFilters = useNumericFilters(filters);
  const nameFilter = useNameFilter(filters);
  const sortFilters = useSortFilters(filters);

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
    numericFilters,
    nameFilter,
    sortFilters,
  });
  const prevRef = previousValues.current;
  // const dataHasPlanets = state.filteredPlanets && state.filteredPlanets.length > 0;

  useEffect(() => {
    // console.log(state.filteredPlanets);
    if (previousValues.current.sortFilters !== sortFilters) {
      const sortedPlanets = sortColumns(sortFilters, filteredPlanets);
      setfilteredPlanets(sortedPlanets);
      previousValues.current.sortFilters = sortFilters;
    }
    return () => {
      previousValues.current = prevRef;
    };
  }, [sortFilters, filteredPlanets, prevRef, setfilteredPlanets]);

  useEffect(() => {
    if (previousValues.current.nameFilter !== nameFilter) {
      const planetsByName = filterByName(nameFilter, filteredPlanets);
      setfilteredPlanets(planetsByName);
      previousValues.current.nameFilter = nameFilter;
    }

    return () => {
      previousValues.current = prevRef;
    };
  }, [nameFilter, filteredPlanets, prevRef, setfilteredPlanets]);

  useEffect(() => {
    if (previousValues.current.numericFilters !== numericFilters) {
      numericFilters.forEach(({ numericValues, numericValues: { column, comparison, value } }) => {
        if (column !== '' && comparison !== '' && value !== '') {
          const planetsByNumericData = filterByNumericValues(numericValues, filteredPlanets);
          setfilteredPlanets(planetsByNumericData);
          // addFilterRow(numericFilters, filters, setFilters);
        }
      });
      previousValues.current.numericFilters = numericFilters;
    }
    return () => {
      previousValues.current = prevRef;
      // removeLastFilterRow(filters, setFilters);
    };
  }, [numericFilters, filteredPlanets, prevRef, setfilteredPlanets]);

  return null;
}
