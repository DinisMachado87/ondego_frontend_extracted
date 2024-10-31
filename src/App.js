import React, { useState } from "react";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";

import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import EventCreateForm from "./pages/events/EventCreateForm";
import EventPage from "./pages/events/EventPage";
import EventsPage from "./pages/events/EventsPage";
import ProfilePage from "./pages/profiles/ProfilePage";
import EventEditForm from "./pages/events/EventEditForm";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import { Redirect } from "react-router-dom";
import LatestFriendsLogIn from "./pages/profiles/LatestFriendsLogIn";
import Instructions from "./pages/intructions/Instructions";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";
  const [query, setQuery] = useState("");

  return (
    <div className={styles.App}>
      <NavBar setQuery={setQuery}/>
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path='/'
            render={() =>
              currentUser ? (
                <EventsPage query={query} message="sorry, couldn't find anything göing ön here. Maybe you can can start an ëvent..? or maybe a book in the sofa?" />
              ) : (
                <Redirect to='/signin' />
              )
            }
          />
          <Route
            exact
            path='/goingon'
            render={() =>
              currentUser ? (
                <EventsPage
                  message="Sorry, couldn't find anything going on here. This page shows you events happening now or in the comming 2 h. Maybe you can start an event..?"
                  filter={`going_on=true`}
                />
              ) : (
                <Redirect to='/signin' />
              )
            }
          />
          <Route
            exact
            path='/joining'
            render={() =>
              currentUser ? (
                <EventsPage
                  message="Sorry, couldn't find anything göing ön here. Maybe you can start an event..?"
                  filter={`joining_owner=${profile_id}&joining_status=2`}
                />
              ) : (
                <Redirect to='/signin' />
              )
            }
          />
          <Route
            exact
            path='/signin'
            render={() => (currentUser ? <Redirect to='/' /> : <SignInForm />)}
          />
          <Route
            exact
            path='/signup'
            render={() => (currentUser ? <Redirect to='/' /> : <SignUpForm />)}
          />
          <Route
            exact
            path='/event/create'
            render={() =>
              currentUser ? <EventCreateForm /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/event/:id/edit'
            render={() =>
              currentUser ? <EventEditForm /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/events/:id'
            render={() =>
              currentUser ? <EventPage /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/profiles/:id'
            render={() =>
              currentUser ? <ProfilePage /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/latestfriendslogin/:id'
            render={() =>
              currentUser ? <LatestFriendsLogIn /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/profiles/:id/edit/username'
            render={() =>
              currentUser ? <UsernameForm /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/profiles/:id/edit/password'
            render={() =>
              currentUser ? <UserPasswordForm /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/profiles/:id/edit'
            render={() =>
              currentUser ? <ProfileEditForm /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/instructions'
            render={() => <Instructions />}
          />
          <Route render={() => <h1>Page Not Found!</h1>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
