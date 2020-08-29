import { useEffect, useState } from "react";
import mem from "mem";

const fetchData = mem(
  async (url) => {
    const response = await fetch(url);
    return await response.json();
  },
  { maxAge: 20000 }
);

export const useData = (url, skip = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip) {
      setLoading(false);
    } else {
      setLoading(true);

      fetchData(url)
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [url, skip]);

  return { data, loading, error };
};
