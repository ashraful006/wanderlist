import { useState, useEffect, useCallback } from "react";

let tokenExpirationTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [expirationTime, setExpirationTime] = useState();

	const logIn = useCallback((userId, token, expirationTime) => {
    setToken(token);
    const tokenExpirationTime = expirationTime || new Date(new Date().getTime() + 1000 * 60 *60);
    setExpirationTime(tokenExpirationTime);
    localStorage.setItem('userData', JSON.stringify({ userId: userId, token: token, expirationTime: tokenExpirationTime }));
    setUserId(userId);
  }, []);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    if (storedUserData && storedUserData.token && new Date(storedUserData.expirationTime) > new Date()) {
      logIn(storedUserData.userId, storedUserData.token);
    }
  }, [logIn]);

  const logOut = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationTime) {
      const remainingTime = expirationTime.getTime() - new Date().getTime();
      tokenExpirationTimer = setTimeout(logOut, remainingTime);
    } else {
      clearTimeout(tokenExpirationTimer);
    }

  },[logOut, token, expirationTime]);

	return { token, logIn, logOut, userId };
};
