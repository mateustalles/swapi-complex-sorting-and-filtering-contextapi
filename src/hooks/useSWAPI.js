import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useSWAPI() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const URL = 'https://swapi-trybe.herokuapp.com/api/planets';

    const fetchPlanets = async () => axios.get(URL)
      .then((response) => response.data)
      .then(({ results }) => setData([...results]))
      .catch((error) => {
        throw error;
      });

    fetchPlanets();

    return () => {
      setData([]);
    };
  }, [setData]);

  return data;
}
