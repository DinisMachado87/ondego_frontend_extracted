import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import Profile from "./Profiles";
import { useProfileData } from "../../contexts/ProfileDataContext";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/LatestFriendsLogIn.module.css";

const LatestFriendsLogIn = ({ mobile, query }) => {
  const currentUser = useCurrentUser();
  const { latestFriendsLogIn } = useProfileData();

  const profiles = useMemo(() => {
    if (latestFriendsLogIn.results) {
      let filteredProfiles = currentUser
        ? latestFriendsLogIn.results.filter(
            (profile) => profile.id !== currentUser.pk
          )
        : latestFriendsLogIn.results;

      if (query) {
        filteredProfiles = filteredProfiles.filter((profile) =>
          profile.username.toLowerCase().includes(query.toLowerCase())
        );
      }

      return filteredProfiles;
    }
    return [];
  }, [latestFriendsLogIn.results, currentUser, query]); 

  const hasLoaded = useMemo(
    () => !!latestFriendsLogIn.results,
    [latestFriendsLogIn.results]
  );

  const currentUserProfile = useMemo(() => {
    return currentUser && latestFriendsLogIn.results
      ? latestFriendsLogIn.results.filter(
          (profile) => profile.id === currentUser.pk
        )
      : [];
  }, [latestFriendsLogIn.results, currentUser]);

  const currentUserProfileDeskTop = profiles.length
    ? currentUserProfile.map((currentUser) => (
        <React.Fragment key={currentUser.id}>
          <h3 className={styles.GreenYellow}>Your Profile</h3>
          <Profile
            key={currentUser.id}
            profile={currentUser}
          />
        </React.Fragment>
      ))
    : null;

  const otherProfilesSidebarDeskTop = (
    <>
      <h3 className={styles.GreenYellow}>Last Logins:</h3>
      {profiles.map((profile) => (
        <Profile
          key={profile.id}
          profile={profile}
          mobile={mobile}
        />
      ))}
    </>
  );

  return mobile ? null : (
    <Container
      className={`${appStyles.Content} pt-5 ${
        mobile && "d-lg-none text-right mb-3"
      }`}>
      {!hasLoaded ? (
        <Asset spinner />
      ) : profiles.length ? (
        <>
          {currentUserProfileDeskTop}
          {otherProfilesSidebarDeskTop}
        </>
      ) : (
        <div>No profiles found.</div>
      )}
    </Container>
  );
};

export default LatestFriendsLogIn;
