import { useState, useCallback, useRef, useEffect } from "react"

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
		setIsLoading(true);
    const httpAbortController = new AbortController();
    activeHttpRequest.current.push(httpAbortController);

    try {
      const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal
      });
      const responseData = await response.json();

      activeHttpRequest.current = activeHttpRequest.current.filter(requests => requests !== httpAbortController);
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      return responseData;
    } catch (err) {
			setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);
	
  useEffect( () => {
    return () => {
      activeHttpRequest.current.forEach( abortController => abortController.abort() );
    }
  }, []);
	const clearError = () => {
		setError(null);
	}

	return {isLoading, error, sendRequest, clearError};
}