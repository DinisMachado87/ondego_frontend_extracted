import { axiosReq } from "../../../api/axiosDefaults";

const handleNotRightNowFriendRequest = async (clickedProfile, setProfileData) => {
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

export default handleNotRightNowFriendRequest;