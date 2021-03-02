import {
  useContext,
  // useState,
  useEffect,
  useRef,
  useReducer,
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

export default function usePlanetsFiltering(planetsData) {
  const { filters: [filters] } = useContext(PlanetsDBContext);
  const numericFilters = useNumericFilters(filters);
  const nameFilter = useNameFilter(filters);
  const sortFilters = useSortFilters(filters);

  function init(initialData) {
    return { filteredPlanets: initialData };
  }

  function reducer(state, action) {
    console.log(action.payload);
    switch (action.type) {
      case 'filter':
        return { filteredPlanets: action.payload };
      case 'restore':
        return { filteredPlanets: action.payload };
      case 'init':
        return init(action.payload);
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = useReducer(reducer, planetsData, init);

  const previousValues = useRef({ numericFilters, nameFilter, sortFilters });

  useEffect(() => {
    dispatch({ type: 'init', payload: planetsData });
  }, [planetsData]);

  useEffect(() => {
    // const previousPlanets = state.filteredPlanets;
    const prevRef = previousValues.current;
    if (previousValues.current.sortFilters !== sortFilters) {
      const sortedPlanets = sortColumns(sortFilters, state.filteredPlanets);
      dispatch({ type: 'filter', payload: sortedPlanets });
      previousValues.current.sortFilters = sortFilters;
    }
    return () => {
      previousValues.current = prevRef;
    };
  }, [sortFilters, state.filteredPlanets]);

  useEffect(() => {
    // const previousPlanets = state.filteredPlanets;
    const prevRef = previousValues.current;
    console.log(previousValues.current.nameFilter, nameFilter);
    if (previousValues.current.nameFilter !== nameFilter) {
      const planetsByName = filterByName(nameFilter, state.filteredPlanets);
      dispatch({ type: 'filter', payload: planetsByName });
      previousValues.current.nameFilter = nameFilter;
    }
    return () => {
      previousValues.current = prevRef;
    };
  }, [nameFilter, state.filteredPlanets]);

  useEffect(() => {
    // const previousPlanets = state.filteredPlanets;
    const prevRef = previousValues.current;
    if (previousValues.current.numericFilters !== numericFilters) {
      numericFilters.map(({ numericValues, numericValues: { column, comparison, value } }) => {
        if (column !== '' && comparison !== '' && value !== '') {
          const planetsByNumericData = filterByNumericValues(numericValues, state.filteredPlanets);
          dispatch({ type: 'filter', payload: planetsByNumericData });
          // addFilterRow(numericFilters, filters, setFilters);
        }
        return numericValues;
      });
      previousValues.current.numericFilters = numericFilters;
    }
    return () => {
      previousValues.current = prevRef;
      // removeLastFilterRow(filters, setFilters);
    };
  }, [numericFilters, state.filteredPlanets]);

  return state.filteredPlanets;
}
