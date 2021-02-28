import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// Thanks for brain's base's useStateSafely for helping me handling the memory leaks:
// https://jeffchheng.github.io/brains-base/2019-08-02-usestatesafely/

export default function useSWAPI() {
  const [data, setData] = useState([]);
  const isSafe = useRef(true);

  useEffect(() => {
    isSafe.current = true;
    return () => {
      isSafe.current = false;
    };
  }, []);

  useEffect(() => {
    const URL = 'https://swapi-trybe.herokuapp.com/api/planets';

    const fetchPlanets = async () => axios.get(URL)
      .then((response) => response.data)
      .then(({ results }) => isSafe.current && setData([...results]))
      .catch((error) => {
        throw error;
      });

    if (isSafe.current) fetchPlanets();

    return () => {
      if (isSafe.current) setData([]);
    };
  }, []);

  return data;
}
