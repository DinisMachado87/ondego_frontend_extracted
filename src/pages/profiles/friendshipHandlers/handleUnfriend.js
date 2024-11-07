import { axiosReq } from "../../../api/axiosDefaults";

const handleUnfriend = async (clickedProfile, currentUser, setProfileData) => {
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

export default handleUnfriend;
