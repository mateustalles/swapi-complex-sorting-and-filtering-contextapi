import React from 'react';
import { act, cleanup, wait, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import renderWithRouter from '../services/renderWithRouter';
import PlanetsDBProvider from '../context/PlanetsDBContext';
import useSWAPI from '../hooks/useSWAPI';
import PlanetsTable from '../components/PlanetsTable';
import NameFilter from '../components/NameFilter';

let getAllTestIds = null;
let getTestId = null;

beforeEach(() => {
  act(() => {
    const { getByTestId, getAllByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NameFilter />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );
    getTestId = getByTestId;
    getAllTestIds = getAllByTestId;
  });
});

afterEach(() => {
  cleanup();
});

describe('Tests Table component', () => {
  it('if planets are fetched, render table', async () => {
    expect.assertions(1);

    await wait(() => getTestId('table-container'));
    const tableContainer = getTestId('table-container');
    expect(tableContainer).toBeInTheDocument();
  }, 60000);

  it('each cell contains data related to planets fetched from API', async () => {
    expect.assertions(130);

    await wait(() => getAllTestIds('table-row'));
    const tableRows = getAllTestIds('table-row');
    const rowsData = tableRows.map((row) => String(row.innerHTML));

    const wrapper = ({ children }) => <PlanetsDBProvider>{children}</PlanetsDBProvider>;

    const { result: fetchedPlanets, waitForNextUpdate } = await renderHook(
      () => useSWAPI(), { wrapper },
    );
    await waitForNextUpdate();

    fetchedPlanets.current.forEach((planet) => Object.keys(planet).forEach(
      (property) => {
        if (property === 'residents') return null;
        if (property === 'films') {
          return expect(rowsData.some((row) => row.includes(`${planet[property]}`.replace(/,/g, '')))).toBeTruthy();
        }
        return expect(rowsData.some((row) => row.includes(planet[property]))).toBeTruthy();
      },
    ));
  }, 60000);

  it('if names is input, table filters by name', async () => {
    expect.assertions(3);
    await wait(() => getTestId('name-filter-input'));
    const nameFilterInput = getTestId('name-filter-input');

    fireEvent.change(nameFilterInput, { target: { value: 'tatooine' } });

    await wait(() => getTestId('table-row'));
    const tableRows = getAllTestIds('table-row');
    const rowsData = tableRows.map((row) => String(row.innerHTML));

    tableRows.forEach((row) => expect(row).toBeInTheDocument());
    expect(tableRows.length).toBe(1);
    expect(rowsData[0]).toMatch(/tatooine/i);
  }, 60000);
});
