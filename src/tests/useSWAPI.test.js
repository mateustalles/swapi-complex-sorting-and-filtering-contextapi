import React from 'react';
import { cleanup } from '@testing-library/react';
import PropTypes from 'prop-types';
import { renderHook } from '@testing-library/react-hooks';
import PlanetsDBProvider from '../context/PlanetsDBContext';
import useSWAPI from '../hooks/useSWAPI';

afterEach(cleanup);

describe('tests planetsDB api', () => {
  it('it fetches planets', async () => {
    const planetProperties = {
      name: expect.any(String),
      rotation_period: expect.any(String),
      orbital_period: expect.any(String),
      diameter: expect.any(String),
      climate: expect.any(String),
      gravity: expect.any(String),
      terrain: expect.any(String),
      surface_water: expect.any(String),
      population: expect.any(String),
      residents:
        [expect.any(String),
          expect.any(String),
          expect.any(String)],
      films: [expect.any(String)],
      created: expect.any(String),
      edited: expect.any(String),
      url: expect.any(String),
    };
    const wrapper = ({ children }) => <PlanetsDBProvider>{children}</PlanetsDBProvider>;

    const { result: fetchedPlanets, waitForNextUpdate } = await renderHook(
      () => useSWAPI(), { wrapper },
    );

    await waitForNextUpdate();

    expect(fetchedPlanets.current).toEqual(expect.arrayContaining(
      Array(expect.objectContaining(planetProperties)),
    ));
  }, 60000);
});
