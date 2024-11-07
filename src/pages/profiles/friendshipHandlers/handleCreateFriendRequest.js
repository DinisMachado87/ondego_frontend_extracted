import { axiosRes } from "../../../api/axiosDefaults";

const handleCreateFriendRequest = async (clickedProfile, setProfileData) => {
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

export default handleCreateFriendRequest;
