import React, { useContext } from 'react';
import { cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import PlanetsDBProvider, { PlanetsDBContext } from '../context/PlanetsDBContext';

afterEach(cleanup);

describe('Tests PlanetsDBContext', () => {
  it('store contains filters structure', () => {
    const wrapper = ({ children }) => <PlanetsDBProvider>{children}</PlanetsDBProvider>;

    const { result: store } = renderHook(() => useContext(PlanetsDBContext), { wrapper });

    expect(store.current).toEqual(expect.objectContaining({ filters: expect.anything() }));
  });
});
