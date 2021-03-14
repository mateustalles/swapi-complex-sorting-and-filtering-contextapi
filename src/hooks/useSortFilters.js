import {
  useEffect,
  useRef,
  useState,
} from 'react';

export default function useSortFilters(filters) {
  const [sortFilters, setSortFilters] = useState([]);
  const isSafe = useRef(true);

  useEffect(() => {
    isSafe.current = true;
    return () => {
      isSafe.current = false;
    };
  }, []);

  useEffect(() => {
    const updatedSortFilters = filters.filter((filter) => 'order' in filter);

    if (isSafe.current) setSortFilters(updatedSortFilters);

    return () => {
      if (isSafe.current) setSortFilters([]);
    };
  }, [filters]);

  return sortFilters;
}
