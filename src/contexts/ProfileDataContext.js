import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useCurrentUser } from './CurrentUserContext';

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

  const handleUnfriend = async (clickedProfile) => {
    try {
      await axiosReq.delete(`/friends/${clickedProfile.friends_id.pk}/`);
      setProfileData((prevState) => {
        return {
          ...prevState,
          pageProfile: {
            results: prevState.pageProfile.results.map((profile) =>
              profile.id === clickedProfile.id
                ? { ...profile, friends_id: null }
                : profile.id === currentUser.id
                ? { ...profile, friends_id: null }
                : profile
            ),
          },
          latestFriendsLogIn: {
            results: prevState.latestFriendsLogIn.results.map((profile) =>
              profile.id === clickedProfile.id
                ? { ...profile, friends_id: null }
                : profile.id === currentUser.id
                ? { ...profile, friends_id: null }
                : profile
            ),
          },
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleConsentFriendRequest = async (clickedProfile) => {
    try {
      const currentFriendRequest = await axiosReq.get(
        `/friends_requests/${clickedProfile.has_friend_request.pk}/`
      );

      const updatedFriendRequest = {
        ...currentFriendRequest.data,
        is_approved: true,
      };

      await axiosRes.put(
        `/friends_requests/${clickedProfile.has_friend_request.pk}/`,
        updatedFriendRequest
      );

      setProfileData((prevState) => {
        return {
          ...prevState,

          latestFriendsLogIn: {
            results: prevState.latestFriendsLogIn.results.map((profile) =>
              profile.id === clickedProfile.id
                ? // If the profile is the one that sent the friend request
                  {
                    ...profile,
                    friends_id: {
                      friend_id: currentUser.id,
                    },
                    has_requested_friendship: null,
                    has_friend_request: null,
                  }
                : profile.id === currentUser.id
                ? // If the profile is the one that received the friend request
                  {
                    ...profile,
                    friends_id: {
                      friend_id: clickedProfile.id,
                    },
                    has_requested_friendship: null,
                    has_friend_request: null,
                  }
                : profile
            ),
          },
          pageProfile: {
            results: prevState.pageProfile.results.map((profile) =>
              profile.id === clickedProfile.id
                ? // If the profile is the one that sent the friend request
                  {
                    ...profile,
                    friends_id: {
                      friend_id: currentUser.id,
                    },
                    has_requested_friendship: null,
                    has_friend_request: null,
                  }
                : profile.id === currentUser.id
                ? // If the profile is the one that received the friend request
                  {
                    ...profile,
                    friends_id: {
                      friend_id: clickedProfile.id,
                    },
                    has_requested_friendship: null,
                    has_friend_request: null,
                  }
                : profile
            ),
          },
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotRightNowFriendRequest = async (clickedProfile) => {
    try {
      await axiosReq.delete(
        `/friends_requests/${clickedProfile.has_friend_request.pk}/`
      );
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.latestFriendsLogIn.results.map((profile) =>
            profile.id === clickedProfile.id
              ? { ...profile, has_friend_request: null }
              : profile
          ),
        },
        latestFriendsLogIn: {
          results: prevState.latestFriendsLogIn.results.map((profile) =>
            profile.id === clickedProfile.id
              ? { ...profile, has_friend_request: null }
              : profile
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelFriendRequest = async (clickedProfile) => {
    try {
      await axiosReq.delete(
        `/friends_requests/${clickedProfile.has_requested_friendship.pk}/`
      );

      setProfileData((prevState) => {
        const updatedPageProfileResults = prevState.pageProfile.results.map(
          (profile) =>
            profile.id === clickedProfile.id
              ? { ...profile, has_requested_friendship: null }
              : profile
        );

        const updatedLatestFriendsLogInResults =
          prevState.latestFriendsLogIn.results.map((profile) =>
            profile.id === clickedProfile.id
              ? { ...profile, has_requested_friendship: null }
              : profile
          );

        return {
          ...prevState,
          pageProfile: {
            ...prevState.pageProfile,
            results: updatedPageProfileResults,
          },
          latestFriendsLogIn: {
            ...prevState.latestFriendsLogIn,
            results: updatedLatestFriendsLogInResults,
          },
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateFriendRequest = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post(`/friends_requests/`, {
        to_user: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        latestFriendsLogIn: {
          results: prevState.latestFriendsLogIn.results.map((profile) => {
            return profile.id === clickedProfile.id
              ? {
                  ...profile,
                  has_requested_friendship: {
                    friend_id: clickedProfile.id,
                    pk: data.id,
                  },
                }
              : profile;
          }),
        },

        pageProfile: {
          results: prevState.pageProfile.results.map((profile) => {
            return profile.id === clickedProfile.id
              ? {
                  ...profile,
                  has_requested_friendship: {
                    friend_id: clickedProfile.id,
                    pk: data.id,
                  },
                }
              : profile;
          }),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

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
        const { data } = await axiosReq.get('/profiles/?ordering=-last_login');
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
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{
          setProfileData,
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
