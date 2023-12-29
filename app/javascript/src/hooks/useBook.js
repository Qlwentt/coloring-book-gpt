import { useState, useRef } from "react";
import useSWR from "swr";
import { POLLING_INTERVAL } from "../helpers/constants";

const useBook = (id, setShowAlert) => {
  async function fetchBook() {
    const response = await fetch(`/api/v1/books/${id}`);
    const data = await response.json();
    return data.data;
  }

  const [pollingInterval, setPollingInterval] = useState(POLLING_INTERVAL);
  const [almostDone, setAlmostDone] = useState(false);

  const {
    data: book,
    isLoading,
    error,
    mutate: refresh,
  } = useSWR("getBook", fetchBook, {
    refreshInterval: pollingInterval,
    onSuccess: (data) => {
      if (data.image_loaded_count === data.images.length - 1) {
        setAlmostDone(true);
      }
      if (data.image_loaded_count === data.images.length) {
        setPollingInterval(0);
        if (almostDone) {
          setShowAlert(true);
          setAlmostDone(false);
        }
      }
    },
  });

  return {
    book,
    error,
    isLoading,
    refresh,
  };
};

export default useBook;
