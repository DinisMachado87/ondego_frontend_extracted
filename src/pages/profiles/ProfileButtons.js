import React from "react";
import { Row, Button } from "react-bootstrap";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

export default function ProfileButtons({
  is_owner,
  profile,
  handleUnfriend,
  handleConsentFriendRequest,
  handleNotRightNowFriendRequest,
  handleCancelFriendRequest,
  handleCreateFriendRequest,
}) {
  const currentUser = useCurrentUser();

  return (
    <>
      {currentUser && !is_owner ? (
        /** If the current user is not the owner of the profile,
         * display the appropriate button based on the relationship
         * between the current user and the profile owner.
         */
        profile?.friends_id ? (
          /** If the current user is a friend of the profile owner,
           * display the Unfriend button.
           */
          <Row className='justify-content-center no-gutters'>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Orange}`}
              onClick={() => handleUnfriend(profile)}>
              Unfriend
            </Button>
          </Row>
        ) : profile?.has_friend_request ? (
          /** If the current user has a friend request from the profile owner,
           * display the Consent and Not right now buttons
           * to accept or reject the friend request.
           */
          <>
            <Row>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Orange}`}
                onClick={() => handleConsentFriendRequest(profile)}>
                Consent
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Orange}`}
                onClick={() => handleNotRightNowFriendRequest(profile)}>
                Not right now
              </Button>
            </Row>
          </>
          ) : profile?.has_requested_friendship ? (
          /** If the current user has requested friendship from the profile owner,
           * display the Cancel request button to cancel the friend request.
           */
          <Row>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Orange}`}
              onClick={() => handleCancelFriendRequest(profile)}>
              Cancel request
            </Button>
          </Row>
            ) : (
          /** If no friendship process is in progress between the current user
           * and the profile owner, display propose Friendship button.
           */
          <Row>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Orange}`}
              onClick={() => handleCreateFriendRequest(profile)}>
              propose Friendship
            </Button>
          </Row>
        )
      ) : 
      /** If the current user is the owner of the profile,
       * display the Edit profile button.
       */
        null }
    </>
  );
}
