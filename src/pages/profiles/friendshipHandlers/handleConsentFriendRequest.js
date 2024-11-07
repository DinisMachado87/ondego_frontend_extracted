import { axiosReq, axiosRes } from "../../../api/axiosDefaults";

const handleConsentFriendRequest = async (clickedProfile, currentUser, setProfileData) => {
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

export default handleConsentFriendRequest;