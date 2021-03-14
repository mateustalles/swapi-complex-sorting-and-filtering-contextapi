import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { PlanetsDBContext } from '../context/PlanetsDBContext';
import ArrowUp from '../images/arrow up.png';
import ArrowDown from '../images/arrow down.svg';
import '../styles/SortButton.css';

function setSorting(filters, columnName, setSortOrder, setFilters) {
  const switchOrder = (order) => (order === 'ASC' ? 'DESC' : 'ASC');
  if (!filters.some(({ column }) => column === columnName)) {
    setSortOrder('ASC');
    return setFilters([...filters, { column: columnName, order: 'ASC' }]);
  }
  return setFilters(filters.map(
    (sortFilter) => {
      if ('column' in sortFilter && sortFilter.column === columnName) {
        setSortOrder(switchOrder(sortFilter.order));
        return { ...sortFilter, order: switchOrder(sortFilter.order) };
      }
      return sortFilter;
    },
  ));
}

export default function SortButton({ children, columnName }) {
  const {
    filters: [filters, setFilters],
  } = useContext(PlanetsDBContext);

  const [sortOrder, setSortOrder] = useState('');
  const [isSorting, setIsSorting] = useState(false);

  const toggleSortOrder = () => {
    setIsSorting(true);
    setSorting(filters, columnName, setSortOrder, setFilters);
  };

  const removeSorting = () => {
    const otherFilters = filters.filter((filter) => !('column' in filter && filter.column === columnName));
    setFilters(otherFilters);
    setIsSorting(false);
  };

  return (
    <div className="sorting-container">
      <button
        data-testid={`toggle-sort-button-${columnName}`}
        type="button"
        key={columnName}
        onClick={toggleSortOrder}
      >
        {children}
      </button>
      {isSorting && (
      <span>
        {
        sortOrder === 'ASC'
          ? <img data-testid={`sorting-asc-arrow-${columnName}`} src={ArrowUp} alt="ASC sorting" />
          : <img data-testid={`sorting-desc-arrow-${columnName}`} src={ArrowDown} alt="DESC sorting" />
        }
      </span>
      )}
      {isSorting && (
        <button
          type="button"
          data-testid={`remove-sort-button-${columnName}`}
          key={`del_${columnName}`}
          onClick={removeSorting}
        >
          X
        </button>
      )}
    </div>
  );
}

SortButton.propTypes = {
  children: PropTypes.string.isRequired,
  columnName: PropTypes.string.isRequired,
};
