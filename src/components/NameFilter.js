import React, { useContext } from 'react';
import { PlanetsDBContext } from '../context/PlanetsDBContext';

export default function NameFilter() {
  const {
    filters: [filters, setFilters],
    filterStatus: [, setFilteringStatus],
  } = useContext(PlanetsDBContext);

  const dispatchNameFilter = (event) => {
    const { target: { value: nameInput } } = event;
    setFilters(filters.map((filter) => {
      if ('name' in filter && filter.name !== nameInput) return { name: nameInput };
      return filter;
    }));
    if (nameInput !== '') return setFilteringStatus((status) => ({ ...status, name: true }));
    return setFilteringStatus((status) => ({ ...status, name: false }));
  };

  return (
    <div>
      <input
        data-testid="name-filter-input"
        type="text"
        onChange={(e) => dispatchNameFilter(e)}
      />
    </div>
  );
}
