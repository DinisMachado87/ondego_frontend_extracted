import React, { useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Event from './Event';

import styles from '../../styles/EventsPage.module.css';
import { useLocation } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import NoResults from '../../assets/no-results.png';
import Asset from '../../components/Asset';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import LatestFriendsLogIn from '../profiles/LatestFriendsLogIn';
import { useRedirect } from '../../hooks/useRedirect';
import SearchBar from '../../components/SearchBar';

function EventsPage({ message, filter = '' }) {
  useRedirect('loggedOut');

  const [events, setEvents] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axiosReq.get(
          `/events/?${filter}&search=${query}`
        );
        setEvents(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname]);

  return (
    <div>
      <Row className='h-100'>
        <Col
          className='py-2 p-0 p-lg-2'
          style={{ position: 'relative' }}
          lg={8}>
          <div>
            <SearchBar
              query={query}
              setQuery={setQuery}
            />
          </div>
          {hasLoaded ? (
            <div className={`px-3`}>
              {events.results.length ? (
                <InfiniteScroll
                  children={events.results.map((event) => (
                    <Event
                      key={event.id}
                      {...event}
                      setEvents={setEvents}
                    />
                  ))}
                  dataLength={events.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!events.next}
                  next={() => fetchMoreData(events, setEvents)}
                />
              ) : (
                <Container className='appStyles.Content pt-5'>
                  <Asset
                    src={NoResults}
                    message={message}
                  />
                </Container>
              )}
            </div>
          ) : (
            <Asset spinner />
          )}
        </Col>
        <Col
          className={`${styles.ProfileList} d-none d-lg-block`}
          lg={4}>
          <Container>
            <LatestFriendsLogIn />
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default EventsPage;
