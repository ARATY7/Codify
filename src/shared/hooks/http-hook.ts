import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
    const [errors, setErrors] = useState<{ [key: number]: string | null }>({});

    const activeHttpRequests = useRef<Record<number, AbortController>>({});

    const sendRequest = useCallback(
      async (
        key: number,
        url: string,
        method: string = 'GET',
        body: string | null,
        headers = {}
      ) => {
          setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [key]: true }));
          const httpAbortCtrl = new AbortController();
          activeHttpRequests.current[key] = httpAbortCtrl;

          try {
              const response = await fetch(import.meta.env.VITE_BACKEND_URL + url, {
                  method,
                  body,
                  headers,
                  signal: httpAbortCtrl.signal,
              });

              const responseData = await response.json();

              delete activeHttpRequests.current[key];

              if (!response.ok) {
                  setErrors((prevErrors) => ({ ...prevErrors, [key]: responseData.message }));
                  throw new Error(responseData.message);
              }

              setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [key]: false }));
              return responseData;
          } catch (err: any) {
              if (err.name !== 'AbortError') {
                  setErrors((prevErrors) => ({ ...prevErrors, [key]: err.message }));
                  throw err;
              }
          } finally {
              delete activeHttpRequests.current[key];
              setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [key]: false }));
          }
      },
      []
    );

    const clearError = (key: number) => {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: null }));
    };

    useEffect(() => {
        return () => {
            Object.values(activeHttpRequests.current).forEach((abortCtrl) => abortCtrl.abort());
        };
    }, []);

    return { isLoading, errors, sendRequest, clearError };
};
