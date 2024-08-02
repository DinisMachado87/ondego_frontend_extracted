import React from "react";
import { Row, Col, Image, Container } from "react-bootstrap";
import styles from "../../styles/LatestFriendsLogIn.module.css";
import appStyles from "../../App.module.css";

function Instructions() {

  const instructionsPicture = (
    <Image
      className={`mx-3`}
      src={
        "https://res.cloudinary.com/drgepxrpe/image/upload/v1712698055/ondego_event_placeholder/ppumyfwefatzziuko1ru"
      }
      width='100%'
      rounded
    />
  );

  return (
    <div>
      <Row>
        <Col>
          <h3 className={`${styles.GreenYellow} mt-5 pb-2`}>
            öndëgö about and instructions:
          </h3>
          <p>
            öndëgö (pronounced "on the go" but cosy) is your helper for
            spontaneous meets with your friends.
          </p>
          <p>
            You can see all users and request them as friends, but you can only
            see events created by your friends so things keep cosy and private.
          </p>
          <p>
            Create a simple event clicking the button "Create Event" in the top
            right corner and get your friends to join.
          </p>
          <p>
            Or check out the events your friends have going on or starting in
            the coming 2 hours by clicking the button "Going ön".
          </p>
          <p>
            Let your friends know if you are joining, considering or can't make
            it by clicking the icons in the bottom of each event.
          </p>
          <p>
            Check out the profile of your friends by clicking their Avatar or
            photo.
          </p>
          <p>
            Edit your profile by clicking the button "Profile" in the top right
            corner.
          </p>
          <p>
            Comment on the events to let your friends know what you think or ask
            questions.
          </p>
          <p>
            Communicate intention with the fields "feeling" and "would like to"
            in your profile and "intention" in the event.
          </p>
          <p>Have fun!</p>
        </Col>
        <Col className={` d-none d-md-block `}>
          <Container className={`mt-3 ${appStyles.Content}`}>
            { instructionsPicture }
          </Container>
        </Col>
      </Row>
      <Row className='d-md-none'>
        <Container className={`mt-3 ${appStyles.Content}`}>
          { instructionsPicture }
        </Container>
      </Row>
    </div>
  );
}

export default Instructions;
