import {
  useEffect,
  useRef,
  useState,
} from 'react';

export default function useNameFilter(filters) {
  const [nameFilter, setNameFilter] = useState([]);
  const isSafe = useRef(true);

  useEffect(() => {
    isSafe.current = true;
    return () => {
      isSafe.current = false;
    };
  }, []);

  useEffect(() => {
    const updatedNameFilter = filters.filter((filter) => 'name' in filter);

    if (isSafe.current) setNameFilter(updatedNameFilter);

    return () => {
      if (isSafe.current) setNameFilter([]);
    };
  }, [filters]);

  return nameFilter;
}
