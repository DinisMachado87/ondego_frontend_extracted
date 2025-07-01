import React from 'react';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Routes, Navigate } from 'react-router-dom';
import './api/axiosDefaults';

import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import EventCreateForm from './pages/events/EventCreateForm';
import EventPage from './pages/events/EventPage';
import EventsPage from './pages/events/EventsPage';
import ProfilePage from './pages/profiles/ProfilePage';
import EventEditForm from './pages/events/EventEditForm';
import { useCurrentUser } from './contexts/CurrentUserContext';
import UsernameForm from './pages/profiles/UsernameForm';
import UserPasswordForm from './pages/profiles/UserPasswordForm';
import ProfileEditForm from './pages/profiles/ProfileEditForm';
import LatestFriendsLogIn from './pages/profiles/LatestFriendsLogIn';
import Instructions from './pages/intructions/Instructions';

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || '';

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          <Route
            path='/'
            element={
              currentUser ? (
                <EventsPage message="sorry, couldn't find anything göing ön here. Maybe you can can start an ëvent..? or maybe a book in the sofa?" />
              ) : (
                <Navigate to='/signin' />
              )
            }
          />
          <Route
            path='/goingon'
            element={
              currentUser ? (
                <EventsPage
                  message="Sorry, couldn't find anything going on here. This page shows you events happening now or in the comming 2 h. Maybe you can start an event..?"
                  filter={`going_on=true`}
                />
              ) : (
                <Navigate to='/signin' />
              )
            }
          />
          <Route
            path='/joining'
            element={
              currentUser ? (
                <EventsPage
                  message="Sorry, couldn't find anything göing ön here. Maybe you can start an event..?"
                  filter={`joining_owner=${profile_id}&joining_status=2`}
                />
              ) : (
                <Navigate to='/signin' />
              )
            }
          />
          <Route
            path='/signin'
            element={currentUser ? <Navigate to='/' /> : <SignInForm />}
          />
          <Route
            path='/signup'
            element={currentUser ? <Navigate to='/' /> : <SignUpForm />}
          />
          <Route
            path='/event/create'
            element={
              currentUser ? <EventCreateForm /> : <Navigate to='/signin' />
            }
          />
          <Route
            path='/event/:id/edit'
            element={
              currentUser ? <EventEditForm /> : <Navigate to='/signin' />
            }
          />
          <Route
            path='/events/:id'
            element={currentUser ? <EventPage /> : <Navigate to='/signin' />}
          />
          <Route
            path='/profiles/:id'
            element={currentUser ? <ProfilePage /> : <Navigate to='/signin' />}
          />
          <Route
            path='/latestfriendslogin/:id'
            element={
              currentUser ? <LatestFriendsLogIn /> : <Navigate to='/signin' />
            }
          />
          <Route
            path='/profiles/:id/edit/username'
            element={currentUser ? <UsernameForm /> : <Navigate to='/signin' />}
          />
          <Route
            path='/profiles/:id/edit/password'
            element={
              currentUser ? <UserPasswordForm /> : <Navigate to='/signin' />
            }
          />
          <Route
            path='/profiles/:id/edit'
            element={
              currentUser ? <ProfileEditForm /> : <Navigate to='/signin' />
            }
          />
          <Route
            path='/instructions'
            element={<Instructions />}
          />
          <Route
            path='*'
            element={<h1>Page Not Found!</h1>}
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
