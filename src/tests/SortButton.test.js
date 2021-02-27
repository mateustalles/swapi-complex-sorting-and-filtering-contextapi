import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import PlanetsDBProvider from '../context/PlanetsDBContext';
import PlanetsTable from '../components/PlanetsTable';

afterEach(cleanup);

describe('Tests SortButton component', () => {
  const columnNames = ['rotation_period', 'orbital_period', 'diameter', 'climate', 'gravity', 'terrain', 'surface_water', 'population', 'films', 'created', 'edited', 'url'];

  it('document contains buttons for all columns to toggle sort', () => {
    expect.assertions(12);

    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    columnNames.forEach((name) => expect(getByTestId(`toggle-sort-button-${name}`)).toBeInTheDocument());
  });

  it('when sorting button is clicked, a remove button for that column appears and arrow sorting changes', async () => {
    expect.assertions(84);

    const { getByTestId, queryByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    columnNames.forEach(async (name) => {
      fireEvent.click(getByTestId(`toggle-sort-button-${name}`));
      expect(getByTestId(`remove-sort-button-${name}`)).toBeInTheDocument();
      expect(getByTestId(`sorting-asc-arrow-${name}`)).toBeInTheDocument();
      fireEvent.click(getByTestId(`toggle-sort-button-${name}`));
      expect(getByTestId(`sorting-desc-arrow-${name}`)).toBeInTheDocument();
      fireEvent.click(getByTestId(`toggle-sort-button-${name}`));
      expect(getByTestId(`sorting-asc-arrow-${name}`)).toBeInTheDocument();
      fireEvent.click(getByTestId(`remove-sort-button-${name}`));
      expect(queryByTestId(`sorting-asc-arrow-${name}`)).toBeNull();
      expect(queryByTestId(`sorting-desc-arrow-${name}`)).toBeNull();
      expect(queryByTestId(`remove-sort-button-${name}`)).toBeNull();
    });
  });
});
