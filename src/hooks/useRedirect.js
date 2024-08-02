import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post('/dj-rest-auth/token/refresh/')
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // Redirects to the login page if the user is not authenticated
        if (err.response.status === "loggedOut") {
          history.push("/signin");
        }
      }
    };

    handleMount();
  }, [userAuthStatus, history]);
};
