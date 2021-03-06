import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const PlanetsDBContext = createContext();

export default function PlanetsDBProvider({ children }) {
  const [planetsData, setPlanetsData] = useState(null);
  const [filteredPlanets, setFilteredPlanets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilteredByName, setIsFilteredByName] = useState(false);
  const [filters, setFilters] = useState([
    {
      name: '',
    },
    {
      numericFilters: [
        {
          numericValues: {
            column: '',
            comparison: '',
            value: '',
          },
        },
      ],
    },
    { column: 'name', order: 'ASC' },
  ]);
  const [selectors, setSelectors] = useState([
    ['population', 'Population'],
    ['orbital_period', 'Orbital period'],
    ['diameter', 'Diameter'],
    ['rotation_period', 'Rotation period'],
    ['surface_water', 'Surface water'],
  ]);
  const [filteringStatus, setFilteringStatus] = useState({
    name: false,
    numeric: false,
  });

  const store = {
    data: [planetsData, setPlanetsData],
    planets: [filteredPlanets, setFilteredPlanets],
    loading: [isLoading, setIsLoading],
    filters: [filters, setFilters],
    nameFilter: [isFilteredByName, setIsFilteredByName],
    filterStatus: [filteringStatus, setFilteringStatus],
    selectors: [selectors, setSelectors],
  };

  return <PlanetsDBContext.Provider value={store}>{children}</PlanetsDBContext.Provider>;
}

PlanetsDBProvider.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
};
