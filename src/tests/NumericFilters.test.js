import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import PlanetsDBProvider from '../context/PlanetsDBContext';
import PlanetsTable from '../components/PlanetsTable';
import NumericFilters from '../components/numericFilters/NumericFilters';

afterEach(cleanup);

describe('Tests Number Filter Inputs component', () => {
  it('selector contains all the columns', () => {
    expect.assertions(5);

    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );
    const selectors = [
      ['population', 'Population'],
      ['orbital_period', 'Orbital period'],
      ['diameter', 'Diameter'],
      ['rotation_period', 'Rotation period'],
      ['surface_water', 'Surface water'],
    ];

    selectors.forEach(([value]) => expect(getByTestId(`column-${value}-0`)).toBeInTheDocument());
  });

  it('comparison options are rendered in selector', () => {
    expect.assertions(4);

    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    const comparisonOperators = ['lesserThan', 'higherThan', 'equalsThan', 'null'];

    comparisonOperators.forEach((comparison) => expect(getByTestId(`${comparison}-comparison-0`)).toBeInTheDocument());
  });

  it('has value input fields for each filter row', () => {
    expect.assertions(1);

    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    expect(getByTestId('value-selector-0')).toBeInTheDocument();
  });

  it('has a remove button for each filter row', () => {
    expect.assertions(1);

    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    expect(getByTestId('remove-filter-button-0')).toBeInTheDocument();
  });

  it('adds up a new filter row when all values are properly filled', () => {
    expect.assertions(4);
    const { getByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    fireEvent.change(getByTestId('column-selector-0'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-selector-0'), { target: { value: 'lesserThan' } });
    fireEvent.change(getByTestId('value-selector-0'), { target: { value: '30000000' } });

    expect(getByTestId('remove-filter-button-1')).toBeInTheDocument();
    expect(getByTestId('column-selector-1')).toBeInTheDocument();
    expect(getByTestId('comparison-selector-1')).toBeInTheDocument();
    expect(getByTestId('value-selector-1')).toBeInTheDocument();
  }, 15000);

  it('adds up only until a total of 5 rows', () => {
    expect.assertions(20);
    const { getByTestId, queryByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    const selectors = [
      ['population', 'Population'],
      ['orbital_period', 'Orbital period'],
      ['diameter', 'Diameter'],
      ['rotation_period', 'Rotation period'],
      ['surface_water', 'Surface water'],
    ];

    selectors.forEach((selector, index) => {
      fireEvent.change(getByTestId(`column-selector-${index}`),
        { target: { value: `${selectors[index][0]}` } });
      fireEvent.change(getByTestId(`comparison-selector-${index}`), { target: { value: 'lesserThan' } });
      fireEvent.change(getByTestId(`value-selector-${index}`), { target: { value: '30000000' } });

      expect(getByTestId(`remove-filter-button-${index}`)).toBeInTheDocument();
      expect(getByTestId(`column-selector-${index}`)).toBeInTheDocument();
      expect(getByTestId(`comparison-selector-${index}`)).toBeInTheDocument();
      expect(getByTestId(`value-selector-${index}`)).toBeInTheDocument();
    });
  });

  it('erases filter rows properly', async () => {
    expect.assertions(4);

    const { getByTestId, queryByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    fireEvent.change(getByTestId('column-selector-0'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-selector-0'), { target: { value: 'lesserThan' } });
    fireEvent.change(getByTestId('value-selector-0'), { target: { value: '30000000' } });

    fireEvent.click(getByTestId('remove-filter-button-0'));

    expect(queryByTestId('remove-filter-button-1')).toBeNull();
    expect(queryByTestId('column-selector-1')).toBeNull();
    expect(queryByTestId('comparison-selector-1')).toBeNull();
    expect(queryByTestId('value-selector-1')).toBeNull();
  });

  it('will not delete the first filter row - I', () => {
    expect.assertions(4);

    const { getByTestId, queryByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    fireEvent.click(getByTestId('remove-filter-button-0'));

    expect(queryByTestId('remove-filter-button-0')).toBeInTheDocument();
    expect(queryByTestId('column-selector-0')).toBeInTheDocument();
    expect(queryByTestId('comparison-selector-0')).toBeInTheDocument();
    expect(queryByTestId('value-selector-0')).toBeInTheDocument();
  });

  it('will not delete the last filter row - II', () => {
    expect.assertions(1);
    const { getByTestId, queryByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    const reverseArray = [3, 2, 1, 0];

    const selectors = [
      ['population', 'Population'],
      ['orbital_period', 'Orbital period'],
      ['diameter', 'Diameter'],
      ['rotation_period', 'Rotation period'],
      ['surface_water', 'Surface water'],
    ];

    selectors.forEach((selector, index) => {
      fireEvent.change(getByTestId(`column-selector-${index}`),
        { target: { value: `${selectors[index][0]}` } });
      fireEvent.change(getByTestId(`comparison-selector-${index}`), { target: { value: 'lesserThan' } });
      fireEvent.change(getByTestId(`value-selector-${index}`), { target: { value: '30000000' } });
    });

    reverseArray.forEach((rowIndex) => {
      fireEvent.click(getByTestId(`remove-filter-button-${rowIndex}`));
      fireEvent.click(getByTestId(`remove-filter-button-${rowIndex - 1}`));
      expect(queryByTestId(`remove-filter-button-${rowIndex}`)).toBeNull();
    });

    expect(queryByTestId('remove-filter-button-0')).toBeInTheDocument();
    expect(queryByTestId('column-selector-0')).toBeInTheDocument();
    expect(queryByTestId('comparison-selector-0')).toBeInTheDocument();
    expect(queryByTestId('value-selector-0')).toBeInTheDocument();
  });

  it('deleting rows in the middle creates no problem', () => {
    expect.assertions(8);
    const { getByTestId, queryByTestId } = renderWithRouter(
      <PlanetsDBProvider>
        <NumericFilters />
        <PlanetsTable />
      </PlanetsDBProvider>,
    );

    fireEvent.change(getByTestId('column-selector-0'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-selector-0'), { target: { value: 'lesserThan' } });
    fireEvent.change(getByTestId('value-selector-0'), { target: { value: '30000000' } });

    fireEvent.change(getByTestId('column-selector-1'), { target: { value: 'diameter' } });
    fireEvent.change(getByTestId('comparison-selector-1'), { target: { value: 'lesserThan' } });
    fireEvent.change(getByTestId('value-selector-1'), { target: { value: '30000000' } });

    fireEvent.click(getByTestId('remove-filter-button-1'));

    fireEvent.click(getByTestId('remove-filter-button-1'));

    expect(queryByTestId('remove-filter-button-1')).toBeInTheDocument();
    expect(queryByTestId('column-selector-1')).toBeInTheDocument();
    expect(queryByTestId('comparison-selector-1')).toBeInTheDocument();
    expect(queryByTestId('value-selector-1')).toBeInTheDocument();

    expect(queryByTestId('remove-filter-button-2')).toBeNull();
    expect(queryByTestId('column-selector-2')).toBeNull();
    expect(queryByTestId('comparison-selector-2')).toBeNull();
    expect(queryByTestId('value-selector-2')).toBeNull();
  });
});
