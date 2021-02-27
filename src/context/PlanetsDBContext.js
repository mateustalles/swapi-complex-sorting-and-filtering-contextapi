import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const PlanetsDBContext = createContext();

export default function PlanetsDBProvider({ children }) {
  const [planetsData, setPlanetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilteredByName, setIsFilteredByName] = useState(false);
  const [filters, setFilters] = useState([
    {
      name: '',
    },
    {
      numericValues: {
        column: '',
        comparison: '',
        value: '',
      },
    },
    { column: 'name', order: 'ASC' },
  ]);

  const addNewFilter = (event, filterIndex) => {
    const numericFilters = filters.filter((filter) => 'numericValues' in filter);
    setFilters(
      filters.map((filter) => {
        if ('numericValues' in filter && numericFilters.indexOf(filter) === filterIndex) {
          return {
            numericValues:
            { ...filter.numericValues, [event.target.id]: event.target.value },
          };
        }
        return filter;
      }),
    );
  };

  const store = {
    data: [planetsData, setPlanetsData],
    loading: [isLoading, setIsLoading],
    filters: [filters, setFilters, addNewFilter],
    nameFilter: [isFilteredByName, setIsFilteredByName],
  };

  return <PlanetsDBContext.Provider value={store}>{children}</PlanetsDBContext.Provider>;
}

PlanetsDBProvider.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
};
