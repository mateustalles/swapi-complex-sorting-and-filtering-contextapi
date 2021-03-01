import {
  useEffect,
  useRef,
  useState,
} from 'react';

export default function useNumericFilters(filters) {
  const [numericFilters, setNumericFilters] = useState([]);
  const isSafe = useRef(true);

  useEffect(() => {
    isSafe.current = true;
    return () => {
      isSafe.current = false;
    };
  }, []);

  useEffect(() => {
    const updatedNumericFilters = filters.filter((filter) => 'numericValues' in filter);

    if (isSafe.current) setNumericFilters(updatedNumericFilters);

    return () => {
      if (isSafe.current) setNumericFilters([]);
    };
  }, [filters]);

  return numericFilters;
}
