import React, { useContext } from 'react';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';

export default function ValuesField(filterIndex, selectedValue) {
  const { filters: [, , updateFilters] } = useContext(PlanetsDBContext);

  return (
    <input
      data-testid={`value-selector-${filterIndex}`}
      onChange={(e) => updateFilters(e, filterIndex)}
      type="number"
      id="value"
      width="100px"
      value={selectedValue}
    />
  );
}
