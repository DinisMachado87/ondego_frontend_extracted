import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, isTokenExpired } from '../utils/jwtUtils';

export const useRedirect = (userAuthStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const token = getAccessToken();
        if (!token || isTokenExpired(token)) {
          if (userAuthStatus === 'loggedIn') {
            navigate('/signin');
          }
        } else {
          if (userAuthStatus === 'loggedIn') {
            navigate('/');
          }
        }
      } catch (err) {
        // Redirects to the login page if the user is not authenticated
        if (userAuthStatus === 'loggedIn') {
          navigate('/signin');
        }
      }
    };

    handleMount();
  }, [userAuthStatus, navigate]);
};
