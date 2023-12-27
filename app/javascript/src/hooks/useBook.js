import { useSWR } from "swr";

const useBook = (id) => {
  async function fetchBook() {
    const response = await fetch(`/api/v1/books/${id}`);
    const data = await response.json();
    return data;
  }

  const {
    data: book,
    isLoading,
    error,
    mutate: refresh,
  } = useSWR("getBook", fetchBook, {
    refreshInterval: POLLING_INTERVAL,
  });

  return {
    book,
    error,
    isLoading,
    refresh,
  };
};

export default useBook;
