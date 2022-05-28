import { useState } from 'react';

import { localStorageKey } from '../utils/constant';

function useFetch() {
  let storageKey = localStorage[localStorageKey];

  const headers = {
    authorization: `Token ${storageKey}`,
    'Content-Type': 'application/json',
  };

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function makeApiCall(url, method, body) {
    return fetch(url, {
      method: method,
      headers: headers,
      body: body,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Couldn't fetch");
        }
        if (res.status === 204) {
          return res;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setIsLoading(false);
        setError('');
        return data;
      })
      .catch((error) => {
        console.log(error, url, method);
        setError(error);
        setIsLoading(false);
      });
  }

  return {
    error,
    isLoading,
    makeApiCall,
  };
}

export default useFetch;
