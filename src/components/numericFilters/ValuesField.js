import React from 'react';
import PropTypes from 'prop-types';

export default function ValuesField({ filterIndex, value, updateFilters }) {
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

ValuesField.propTypes = {
  filterIndex: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  updateFilters: PropTypes.func.isRequired,
};
