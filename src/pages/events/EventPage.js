import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../styles/EventsPage.module.css";
import { useParams } from "react-router";

import { axiosReq } from "../../api/axiosDefaults";
import Event from "./Event";

import EventCommentCreateForm from "../comments/EventCommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import LatestFriendsLogIn from "../profiles/LatestFriendsLogIn";

function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: event }, { data: comments }] = await Promise.all([
          axiosReq.get(`/events/${id}`),
          axiosReq.get(`/comments/?event=${id}`),
        ]);
        setEvent({ results: [event] });
        setComments(comments);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row>
      <Col className='py-2 p-0 p-lg-2'>
        <Container>
          {hasLoaded && event.results.length ? (
            <Event
              {...event.results[0]}
              eventPage
              setEvents={setEvent}
            />
          ) : (
            <Asset spinner />
          )}
          {currentUser && (
            <EventCommentCreateForm
              event={event.results[0]}
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setEvent={setEvent}
              setComments={setComments}
            />
          )}
          <div className={`${styles.CommentsScrollingContainer} p-2`}>
            <InfiniteScroll
              dataLength={comments.results.length}
              next={() => fetchMoreData(comments, setComments)}
              hasMore={!!comments.next}
              loader={<span>Loading more comments...</span>}>
              {comments.results.length ? (
                comments.results.map((comment) => (
                  <Comment
                    key={comment.id}
                    {...comment}
                    setEvent={setEvent}
                    setComments={setComments}
                  />
                ))
              ) : (
                <span>No comments yet. Be the first to comment!</span>
              )}
            </InfiniteScroll>
          </div>
        </Container>
      </Col>
      <Col
        className={`${styles.ProfileList} d-none d-lg-block`}
        lg={4}>
        <Container>
          <LatestFriendsLogIn />
        </Container>
      </Col>
    </Row>
  );
}

export default EventPage;


