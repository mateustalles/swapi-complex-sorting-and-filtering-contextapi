import React from 'react';
import { cleanup, fireEvent, wait } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import PlanetsDBProvider from '../context/PlanetsDBContext';
import PlanetsTable from '../components/PlanetsTable';
import NameFilter from '../components/NameFilter';

afterEach(cleanup);

describe('Tests Name Filter Input component', () => {
  it('contains a text input', () => {
    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NameFilter />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    const nameFilterInput = getByTestId('name-filter-input');
    expect(nameFilterInput).toBeInTheDocument();
  });

  it('filters planets by text input "an" properly', async () => {
    const { getByTestId, getByText, queryByText } = renderWithRouter(
      <PlanetsDBProvider>
        <NameFilter />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    fireEvent.change(getByTestId('name-filter-input'), { target: { value: 'an' } });

    await wait(() => getByText('Coruscant'));

    expect(getByText('Alderaan')).toBeInTheDocument();
    expect(getByText('Coruscant')).toBeInTheDocument();
    expect(queryByText('Tatooine')).toBeNull();
  }, 15000);

  it('filters planets by text input "t" properly', async () => {
    const { getByTestId, getByText, queryByText } = renderWithRouter(
      <PlanetsDBProvider>
        <NameFilter />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    fireEvent.change(getByTestId('name-filter-input'), { target: { value: 't' } });

    await wait(() => getByText('Tatooine'));


    expect(getByText('Coruscant')).toBeInTheDocument();
    expect(getByText('Hoth')).toBeInTheDocument();
    expect(getByText('Tatooine')).toBeInTheDocument();
    expect(queryByText('Alderaan')).toBeNull();
  }, 15000);
});
