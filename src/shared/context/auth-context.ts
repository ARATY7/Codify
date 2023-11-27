import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    token: '',
    login: (userId: number, userName: string, userEmail: string, token: string, expirationDate: Date) => {
        // eslint-disable-next-line no-self-assign
        userId = userId;
        // eslint-disable-next-line no-self-assign
        userName = userName;
        // eslint-disable-next-line no-self-assign
        userEmail = userEmail;
        // eslint-disable-next-line no-self-assign
        token = token;
        // eslint-disable-next-line no-self-assign
        expirationDate = expirationDate;
    },
    logout: () => {},
    userId: 0,
    userName: '',
    userEmail: ''
});