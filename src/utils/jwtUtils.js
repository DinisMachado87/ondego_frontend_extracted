// JWT Token utilities for Simple JWT
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const setTokens = (access, refresh) => {
  if (access) {
    // Store in sessionStorage for better security (cleared when tab closes)
    sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    // Store refresh token in sessionStorage
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeTokens = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setAuthHeader = (axiosInstance) => {
  const token = getAccessToken();
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const logout = async (axiosInstance) => {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await axiosInstance.post('dj-rest-auth/logout/', {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    console.log('Logout error:', error);
  } finally {
    removeTokens();
    setAuthHeader(axiosInstance);
  }
};
