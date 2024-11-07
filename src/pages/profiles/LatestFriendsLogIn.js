import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import appStyles from '../../App.module.css';
import Asset from '../../components/Asset';
import Profile from './Profiles';
import { useProfileData } from '../../contexts/ProfileDataContext';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import styles from '../../styles/LatestFriendsLogIn.module.css';

const LatestFriendsLogIn = ({ mobile }) => {
  const currentUser = useCurrentUser();
  const { profileData } = useProfileData();

  const profiles = useMemo(() => {
    if (profileData.latestFriendsLogIn?.results) {
      return currentUser
        ? profileData.latestFriendsLogIn.results.filter(
            (profile) => profile.id !== currentUser.pk
          )
        : profileData.latestFriendsLogIn.results;
    }
    return [];
  }, [profileData.latestFriendsLogIn?.results, currentUser]);

  const hasLoaded = useMemo(
    () => !!profileData.latestFriendsLogIn?.results,
    [profileData.latestFriendsLogIn?.results]
  );

  const currentUserProfile = useMemo(() => {
    return currentUser && profileData.latestFriendsLogIn?.results
      ? profileData.latestFriendsLogIn.results.filter(
          (profile) => profile.id === currentUser.pk
        )
      : [];
  }, [profileData.latestFriendsLogIn?.results, currentUser]);

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
        mobile && 'd-lg-none text-right mb-3'
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
