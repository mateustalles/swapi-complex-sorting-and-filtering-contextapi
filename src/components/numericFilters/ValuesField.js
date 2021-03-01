import React from 'react';

export default function ValuesField(filterIndex, value, updateFilters) {
  return (
    <input
      data-testid={`value-selector-${filterIndex}`}
      onChange={(e) => updateFilters(e, filterIndex)}
      type="number"
      id="value"
      width="100px"
      value={value}
    />
  );
}
