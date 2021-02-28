import React, { useContext } from 'react';
import { PlanetsDBContext } from '../../context/PlanetsDBContext';

export default function ComparisonField(filterIndex, selectedOp) {
  const { filters: [, , updateFilters] } = useContext(PlanetsDBContext);

  return (
    <select
      data-testid={`comparison-selector-${filterIndex}`}
      onChange={(e) => updateFilters(e, filterIndex)}
      id="comparison"
      value={selectedOp}
    >
      <option data-testid={`null-comparison-${filterIndex}`} label=" " value="" defaultValue />
      <option data-testid={`lesserThan-comparison-${filterIndex}`} value="lesserThan">{'<'}</option>
      <option data-testid={`equalsThan-comparison-${filterIndex}`} value="equalsThan">=</option>
      <option data-testid={`higherThan-comparison-${filterIndex}`} value="higherThan">{'>'}</option>
    </select>

  );
}
