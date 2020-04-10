import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
// import TextInputFilter from './TextInputFilter';
// import FiltersByNumber from './FiltersByNumber';
import '../style/Table.css';

// const tableHeaders = () => (
//   <tr>
//     <th>Name</th>
//     <th>Rotation period</th>
//     <th>Orbital period</th>
//     <th>Diamater</th>
//     <th>Climate</th>
//     <th>Gravity</th>
//     <th>Terrain</th>
//     <th>Surface Water</th>
//     <th>Population</th>
//     <th>Films</th>
//     <th>Created</th>
//     <th>Edited</th>
//     <th>URL</th>
//   </tr>
// );

// const columnComparison = (column, value) => ({
//   lesserThan: () => column < value,
//   equalsThan: () => column === value,
//   higherThan: () => column > value,
// });

// const filterByPlanetsNames = (planets, filters) => (
//   planets.filter((planet) => planet.name.includes(filters[0].name)));

// const filterByNumericValues = (filteredPlanets, { column, value, comparison }) => (
//   filteredPlanets.filter(
//     (planet) => columnComparison(Number(planet[column]), Number(value))[comparison](),
//   )
// );

const PlanetRows = () => {
  const { data: [planetsData,] } = useContext(PlanetsDBContext);
  console.log(planetsData);

  let filteredPlanets = planetsData;

  // const [nameFilter, ...numericFilters] = filters;

  // if (nameFilter.name) filteredPlanets = filterByPlanetsNames(planets, filters);

  // numericFilters.map((filter) => {
  //   const { numericValues, numericValues: { column, comparison, value } } = filter;
  //   if (column !== '' && comparison !== '' && value !== '') {
  //     filteredPlanets = filterByNumericValues(filteredPlanets, numericValues);
  //     return filter;
  //   }
  //   return filter;
  // });

  // const lastFilter = numericFilters[numericFilters.length - 1];
  // const { numericValues: { column, comparison, value } } = lastFilter;
  // if (column !== '' && comparison !== '' && value !== '') {
  //   dispatch({ type: ADD_NEW_FIELD, column });
  // }

  return (
    planetsData !== undefined ? filteredPlanets.map(({
      name, rotation_period: rotationPeriod, orbital_period: orbitalPeriod, diameter,
      climate, gravity, terrain, surface_water: surfaceWater, population, films, created,
      edited, url,
    }) => (
      <tr key={name}>
        <td>{name}</td>
        <td className="rotation-period">{rotationPeriod}</td>
        <td className="orbital-period">{orbitalPeriod}</td>
        <td className="diameter">{diameter}</td>
        <td>{climate}</td>
        <td>{gravity}</td>
        <td>{terrain}</td>
        <td className="surface-water">{surfaceWater}</td>
        <td className="population">{population}</td>
        <td className="films">{films}</td>
        <td>{created}</td>
        <td>{edited}</td>
        <td>{url}</td>
      </tr>
    ))
      : <div>Loading ...</div>
  );
};

export default function Table() {
  // const { planets, filters } = this.props;
  return (
    <div>
      <h1>StarWars Datatable with Filters</h1>
      <div>
        {/* <TextInputFilter /> */}
      </div>
      <div>
        {/* <FiltersByNumber /> */}
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            {/* {tableHeaders()} */}
          </thead>
          <tbody>
            <PlanetRows />
          </tbody>
        </table>
      </div>
    </div>
  );
}

// const mapStateToProps = ({ planetFetcher, filterByName, filterByNumericValue }) => {
//   const { filters: nameFilters } = filterByName;
//   const { filters: numericFilters } = filterByNumericValue;
//   const filters = [...nameFilters, ...numericFilters];
//   return { planets: planetFetcher.data, filters };
// };
