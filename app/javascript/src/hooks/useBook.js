import { useState, useRef } from "react";
import useSWR from "swr";
import { POLLING_INTERVAL } from "../helpers/constants";

const useBook = (id, setShowAlert) => {
  async function fetchBook() {
    const response = await fetch(`/api/v1/books/${id}`);
    const data = await response.json();
    return { data: data.data, status: response.status, error: data.error };
  }

  const [pollingInterval, setPollingInterval] = useState(POLLING_INTERVAL);

  const {
    data,
    isLoading,
    error,
    mutate: refresh,
  } = useSWR("getBook", fetchBook, {
    refreshInterval: pollingInterval,
    onSuccess: (data) => {
      const book = data.data;
      if (data.error || data.status !== 200) {
        setPollingInterval(0);
        return;
      }
      if (
        book &&
        book.images.every(
          (image) =>
            image.remote_url &&
            image.remote_url.includes("storage.googleapis.com")
        )
      ) {
        setPollingInterval(0);
        if (localStorage.getItem(`${id}.hasShownAlert`) == null) {
          setShowAlert(true);
          localStorage.setItem(`${id}.hasShownAlert`, "true");
        }
      }
    },
  });

  return {
    data,
    error,
    isLoading,
    refresh,
  };
};

export default useBook;
