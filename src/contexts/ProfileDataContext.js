import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser } from './CurrentUserContext';

import handleCancelFriendRequest from '../pages/profiles/friendshipHandlers/handleCancelFriendRequest';
import handleConsentFriendRequest from '../pages/profiles/friendshipHandlers/handleConsentFriendRequest';
import handleCreateFriendRequest from '../pages/profiles/friendshipHandlers/handleCreateFriendRequest';
import handleNotRightNowFriendRequest from '../pages/profiles/friendshipHandlers/handleNotRightNowFriendRequest';
import handleUnfriend from '../pages/profiles/friendshipHandlers/handleUnfriend';

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    latestFriendsLogIn: { results: [] },
  });
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleMount = async () => {
      /**
       * This async function fetches the latest friends log in data
       * then sets the profile data
       */
      if (!currentUser) {
        return;
      }
      try {
        const { data } = await axiosReq.get(
          `/profiles/?search=${query}&ordering=-last_login`
        );
        setProfileData((prevState) => ({
          ...prevState,
          latestFriendsLogIn: data,
        }));
      } catch (err) {
        console.error(
          'Error fetching latest friends log in data:',
          err.message
        );
      }
    };

    handleMount();
  }, [currentUser, query]);

  return (
    <ProfileDataContext.Provider value={{ profileData, query }}>
      <SetProfileDataContext.Provider
        value={{
          setProfileData,
          setQuery,
          handleCancelFriendRequest,
          handleConsentFriendRequest,
          handleCreateFriendRequest,
          handleNotRightNowFriendRequest,
          handleUnfriend,
        }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
