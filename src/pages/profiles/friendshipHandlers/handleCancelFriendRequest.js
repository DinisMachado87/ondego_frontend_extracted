import { axiosReq } from "../../../api/axiosDefaults";

const handleCancelFriendRequest = async (clickedProfile, setProfileData) => {
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

export default handleCancelFriendRequest;
