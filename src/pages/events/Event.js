import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// React
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
// Axios
import { Card, Col, Media, Row } from 'react-bootstrap';
import styles from '../../styles/Event.module.css';
import appStyles from '../../App.module.css';
// styles
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../../components/Avatar';
import EventPage from './EventPage';
import { MoreDropdown } from '../../components/MoreDropdown';
// Components

const Event = (props) => {
  /**
   * destructure the event passed as a prop
   */
  const {
    id,
    owner,
    what_title,
    what_content,
    where_place,
    where_address,
    when_start,
    when_end,
    intention,
    event_image,
    profile_id,
    profile_image,
    joining_status,
    joining_count,
    let_me_see_count,
    not_joining_count,
    setEvents,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [currentPreviousUserChoice, setCurrentPreviousUserChoice] =
    useState(joining_status);
  /** stores the previous user joining status choice
   *  and updates in State every time the user changes their choice
   */
  const handleEdit = () => {
    history.push(`/event/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axiosReq.delete(`/events/${id}/`);
        setEvents((prevEvents) => ({
          ...prevEvents,
          results: prevEvents.results.filter((event) => event.id !== id),
        }));
        history.push('/');
      } catch (err) {
        console.log(err);
      }
    }
  };

  /** Handle the user's click to change their joining status
   * by sending a POST or PUT request to the joinings instance in the API
   * and updating the event joining counts on the state
   */
  const handleJoiningChoice = async (choice) => {
    try {
      const currentUserJoiningThisEvent = (
        await axiosRes.get('/joinings/')
      ).data.results
        .filter((joining) => joining.event === id)
        .find((joining) => joining.owner === currentUser.username);
      if (currentUserJoiningThisEvent) {
        // stores the previous choice to update the event counts later
        if (currentUserJoiningThisEvent.status === choice) {
          // if the user clicks on the same status, do nothing
          return;
        } else {
          // if the user clicks on a different joining status update the choice with PUT
          await axiosReq.put(`/joinings/${currentUserJoiningThisEvent.id}/`, {
            event: id,
            joining_status: choice,
          });
          updateEventCounts(currentPreviousUserChoice, choice);
          setCurrentPreviousUserChoice(choice);
        } // update the state accordingly
      } else {
        // if the user has not a joining instance yet, create a new one with POST
        await axiosReq.post('/joinings/', {
          event: id,
          owner: currentUser.username,
          status: choice,
        });
        updateEventCounts(currentPreviousUserChoice, choice);
        setCurrentPreviousUserChoice(choice);
      } // update the state accordingly
    } catch (err) {
      console.log(err);
    }
  };

  const choiceToCountMap = {
    1: 'not_joining_count',
    2: 'joining_count',
    3: 'let_me_see_count',
  };

  /** Update the joining choice counts in the event object
   * using the previous and new choice values
   * stored in the handleJoiningChoice function
   */
  const updateEventCounts = (currentPreviousUserChoice, newChoice) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      results: prevEvents.results.map((event) => {
        if (event.id === id) {
          /** Maps this event and updates the event counts using the previous
           * and new choice variables stored in the handleJoiningChoice function
           */
          let updatedEvent = { ...event };
          if (currentPreviousUserChoice) {
            updatedEvent[choiceToCountMap[currentPreviousUserChoice]] -= 1;
          }
          if (newChoice) {
            updatedEvent[choiceToCountMap[newChoice]] += 1;
          }
          return updatedEvent;
        } else {
          return event;
        }
      }),
    }));
  };

  const ChoiceButton = ({ choice, count, handleJoiningChoice }) => (
    <span
      onClick={() => handleJoiningChoice(choice)}
      className='IMobileBlock'>
      <i
        className={
          `fa fa-solid ${
            choice === '1'
              ? 'fa-heart-circle-bolt'
              : choice === '2'
              ? 'fa-rocket'
              : 'fa-dice'
          } ` + (currentPreviousUserChoice === choice ? styles.Active : '')
        }></i>
      <p style={{ margin: 0, display: 'inline-block' }}>{count}</p>
    </span>
  );

  return (
    <Card
      style={{ backgroundImage: `url(${event_image})` }}
      className={`${styles.StretchedImage} ${styles.YMargin}`}>
      <Media className={`${styles.Event}`}>
        <Card.Body
          onClick={() => history.push(`/events/${id}`)}
          className={`${styles.TextShadow} ${appStyles.Pointer} d-flex justify-content-between align-items-start`}>
          <div className={`${styles.Container} ${styles.EventBody}`}>
            <div className={`${styles.flexStart}`}>
              <Avatar
                className={styles.Front}
                src={profile_image}
                height={55}
                profile_id={profile_id}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 30,
                  padding: '1.5rem 1rem',
                  fontSize: '1.3rem',
                }}>
                {owner}
              </div>
            </div>
            <h2>
              {what_title && (
                <div className={`${styles.Title}`}>{what_title}</div>
              )}
            </h2>
            <h4>{intention && <span>{intention}</span>}</h4>
            <p>{what_content && <span>{what_content}</span>}</p>
            <br />
            <p>
              {where_place && <span>{ where_place }</span> }
              <br />
              {where_address && <span>{where_address}</span>}
            </p>
            <br />
            <p>
              {when_start && <span>start: {when_start}</span>}
              <br />
              {when_end && <span>end: {when_end}</span>}
            </p>
            <div className={`${styles.flexEnd}`}>
              <img
                alt='event'
                src={event_image}
                className={styles.ProportionalImage}
              />
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className={styles.EventFooter}>
            <Row className={`${styles.EventFooter} `}>
              {is_owner && EventPage && (
                <Col className='col-1'>
                  <MoreDropdown
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                </Col>
              )}
              <Col className={`${styles.choiceButton}`}>
                <ChoiceButton
                  choice='2'
                  count={`${joining_count} joining`}
                  handleJoiningChoice={handleJoiningChoice}
                />
              </Col>
              <Col className={`${styles.choiceButton}`}>
                <ChoiceButton
                  className={styles.choiceButton}
                  choice='3'
                  count={`${let_me_see_count} Maybe`}
                  handleJoiningChoice={handleJoiningChoice}
                />
              </Col>
              <Col className={`${styles.choiceButton}`}>
                <ChoiceButton
                  className={styles.choiceButton}
                  choice='1'
                  count={`${not_joining_count} Can't`}
                  handleJoiningChoice={handleJoiningChoice}
                />
              </Col>
            </Row>
          </div>
        </Card.Footer>
      </Media>
    </Card>
  );
};

export default Event;
