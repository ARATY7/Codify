import { useCallback, useEffect, useState } from 'react';

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {

  const [token, setToken] = useState<string>('');
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const login = useCallback((userId: number, userName: string, userEmail: string, token: string, expirationDate: Date) => {
    setUserId(userId);
    setUserName(userName);
    setToken(token);
    setUserEmail(userEmail);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 25);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify({
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      token: token,
      expiration: tokenExpirationDate.toISOString()
    }));
  }, []);

  const logout = useCallback( () => {
    setUserId(0);
    setUserName('');
    setUserEmail('');
    setToken('');
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
    location.reload();
  }, []);

  useEffect(() => {
    if ( token && tokenExpirationDate ) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if ( userData ) {
      const data = JSON.parse(userData);
      if ( data && data.userId && data.userName && data.userEmail && data.token && new Date(data.expiration) > new Date() ) {
        login(data.userId, data.userName, data.userEmail, data.token, new Date(data.expiration));
      }
    }
  }, [login]);

  return { token, login, logout, userId, userName, userEmail };
};