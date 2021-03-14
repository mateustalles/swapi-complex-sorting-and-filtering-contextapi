import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import PlanetsDBProvider from '../context/PlanetsDBContext';
import App from '../App';

afterEach(cleanup);

describe('Testing main App screen', () => {
  it('displays main app div', () => {
    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <App />
      </PlanetsDBProvider>,
    );
    const mainDiv = getByTestId('main-app');
    expect(mainDiv).toBeInTheDocument();
  });

  it('displays main table container div', () => {
    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <App />
      </PlanetsDBProvider>,
    );
    const tableContainer = getByTestId('table-container-app');
    expect(tableContainer).toBeInTheDocument();
  });
});
