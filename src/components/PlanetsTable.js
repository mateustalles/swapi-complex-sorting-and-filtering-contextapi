import React, {
  useRef,
  useEffect,
  // useContext,
  // useState,
} from 'react';
import { Table } from 'react-bootstrap';
import $ from 'jquery';
import SortButton from './SortButton';
import usePlanetsFiltering from '../hooks/usePlanetsFiltering';
import useSWAPI from '../hooks/useSWAPI';
import '../styles/PlanetsTable.scss';
// import { PlanetsDBContext } from '../context/PlanetsDBContext';

const TableHeaders = () => (
  <tr>
    <th><SortButton columnName="name">Name</SortButton></th>
    <th><SortButton columnName="rotation_period">Rotation period</SortButton></th>
    <th><SortButton columnName="orbital_period">Orbital period</SortButton></th>
    <th><SortButton columnName="diameter">Diamater</SortButton></th>
    <th><SortButton columnName="climate">Climate</SortButton></th>
    <th><SortButton columnName="gravity">Gravity</SortButton></th>
    <th><SortButton columnName="terrain">Terrain</SortButton></th>
    <th><SortButton columnName="surface_water">Surface Water</SortButton></th>
    <th><SortButton columnName="population">Population</SortButton></th>
    <th><SortButton columnName="films">Films</SortButton></th>
    <th><SortButton columnName="created">Created</SortButton></th>
    <th><SortButton columnName="edited">Edited</SortButton></th>
    <th><SortButton columnName="url">URL</SortButton></th>
  </tr>
);

const PlanetsRows = ({ filteredPlanets }) => (
  filteredPlanets.map(({
    name, rotation_period: rotationPeriod, orbital_period: orbitalPeriod, diameter,
    climate, gravity, terrain, surface_water: surfaceWater, population, films, created,
    edited, url,
  }) => (
    <tr className="planet-row" data-testid="table-row" key={name}>
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
);

const enableTopScroll = () => {
  $(function () {
    const tableWidth = $('.table-responsive').width();
    const rowWidth = $('.planet-row').width();
    $('.top-scroll').css('maxWidth', tableWidth);
    $('.top-scroll-content').width(rowWidth + 1);

    $('.top-scroll').scroll(function () {
      $('.table-responsive')
        .scrollLeft($('.top-scroll').scrollLeft());
    });
    $('.table-responsive').scroll(function () {
      $('.top-scroll')
        .scrollLeft($('.table-responsive').scrollLeft());
    });
  });
};

export default function PlanetsTable() {
  const data = useSWAPI();
  const filteredData = usePlanetsFiltering(data);

  useEffect(() => {
    enableTopScroll();
  }, []);

  const tableRef = useRef();

  return (
    <div>
      {/* {isLoading && <span>Loading...</span> } */}
      <div className="top-scroll">
        <div className="top-scroll-content">&nbsp;</div>
      </div>
      <Table striped bordered hover responsive className="planets-table" data-testid="table-container" ref={tableRef}>
        <thead>
          <TableHeaders />
        </thead>
        <tbody className="table-body">
          <PlanetsRows filteredPlanets={filteredData || []} />
        </tbody>
      </Table>
    </div>
  );
}
