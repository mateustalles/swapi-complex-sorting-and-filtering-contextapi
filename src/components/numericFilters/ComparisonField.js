import React from 'react';

export default function ComparisonField(filterIndex, comparison, updateFilters) {
  return (
    <select
      data-testid={`comparison-selector-${filterIndex}`}
      onChange={(e) => updateFilters(e, filterIndex)}
      id="comparison"
      value={comparison}
    >
      <option data-testid={`null-comparison-${filterIndex}`} label=" " value="" defaultValue />
      <option data-testid={`lesserThan-comparison-${filterIndex}`} value="lesserThan">{'<'}</option>
      <option data-testid={`equalsThan-comparison-${filterIndex}`} value="equalsThan">=</option>
      <option data-testid={`higherThan-comparison-${filterIndex}`} value="higherThan">{'>'}</option>
    </select>

  );
}
