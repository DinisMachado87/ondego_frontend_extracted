import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useNavigate } from 'react-router';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  setAuthHeader,
  isTokenExpired,
} from '../utils/jwtUtils';

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) {
        throw new Error('No refresh token');
      }

      const response = await axios.post('token/refresh/', {
        refresh: refresh,
      });

      const { access, refresh: newRefresh } = response.data;
      setTokens(access, newRefresh);
      setAuthHeader(axiosReq);
      setAuthHeader(axiosRes);

      return access;
    } catch (err) {
      removeTokens();
      setAuthHeader(axiosReq);
      setAuthHeader(axiosRes);
      throw err;
    }
  };

  const handleMount = async () => {
    try {
      const token = getAccessToken();
      if (!token || isTokenExpired(token)) {
        await refreshToken();
      }

      const { data } = await axiosReq.get('dj-rest-auth/user/');
      setCurrentUser(data);
    } catch (err) {
      console.log(err.message);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          const token = getAccessToken();
          if (token && isTokenExpired(token)) {
            await refreshToken();
          }
        } catch (err) {
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              navigate('/signin');
            }
            return null;
          });
          return config;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await refreshToken();
            return axiosReq(err.config);
          } catch (refreshErr) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                navigate('/signin');
              }
              return null;
            });
          }
        }
        return Promise.reject(err);
      }
    );
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
