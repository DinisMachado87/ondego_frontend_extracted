import React, { useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import logo from '../assets/ondego.svg';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';
import SearchBar from './SearchBar';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();
  const [selectedChoice, setSelectedChoice] = useState({
    icon: 'fa-solid fa-satellite',
    description: 'all evënts',
    to: '/',
  });

  const handleSelect = (choice) => {
    setSelectedChoice(choice);
  };

  const choices = [
    {
      icon: 'fa-solid fa-satellite',
      description: 'all evënts',
      to: '/',
    },
    {
      icon: 'fa-solid fa-fire',
      description: 'evënts göing on',
      to: '/goingon',
    },
    {
      icon: 'fa-solid fa-rocket',
      description: "evënts I'm jöining",
      to: '/joining',
    },
  ];

  const handleSignOut = async () => {
    try {
      await axios.post('/dj-rest-auth/logout/');
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const dropdownEvents = (
    <Dropdown className={styles.Dropdown}>
      <Dropdown.Toggle
        variant='success'
        id='dropdown-basic'
        className={styles.DropdownToggle}>
        <i className={selectedChoice.icon}></i> {selectedChoice.description}
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.DropdownMenu}>
        {choices.map((choice, index) => (
          <Dropdown.Item
            as='div'
            key={index}
            onClick={() => handleSelect(choice)}
            className={styles.DropdownItem}>
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to={choice.to}>
              <i className={choice.icon}></i> {choice.description}
            </NavLink>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  const EventIconsList = (
    <>
      {choices.map((choice, index) => (
        <NavLink
          key={index}
          exact
          className={styles.NavLink}
          activeClassName={styles.Active}
          to={choice.to}>
          <i className={choice.icon}></i> {choice.description}
        </NavLink>
      ))}
    </>
  );

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to='/event/create'>
        <i className='fa-solid fa-wand-magic-sparkles'></i>add evënt
      </NavLink>
      {window.innerWidth > 750 ? dropdownEvents : EventIconsList}
      <NavLink
        className={styles.NavLink}
        to='/'
        onClick={handleSignOut}>
        <i className='fa-solid fa-lightbulb'></i> Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to={`/latestfriendslogin/${currentUser?.profile_id}`}>
        <i className='fa-solid fa-user'></i> friends and users
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}>
        <Avatar
          src={currentUser?.profile_image}
          height={40}
          profile_id={currentUser?.profile_id}
        />
        my profile
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to='/signin'>
        <i className='fa-solid fa-plug'></i>Sign in
      </NavLink>
      <NavLink
        to='/signup'
        className={styles.NavLink}
        activeClassName={styles.Active}>
        <i className='fa-solid fa-user-astronaut'></i>register
      </NavLink>
    </>
  );

  return (
    <>
      <Navbar
        expanded={expanded}
        className={`${styles.NavBar} navbar-dark px-3`}
        text='darkviolet'
        border='blue'
        expand='md'
        fixed='top'>
        <NavLink to='/'>
          <Navbar.Brand>
            <img
              src={logo}
              alt='logo'
              height='45'
              className='p-2'
            />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls='basic-navbar-nav'
          style={{ borderRadius: '1rem', borderColor: 'darkviolet' }}
        />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className={`ml-auto ${expanded ? styles.expanded : ''}`}>
            {currentUser ? loggedInIcons : loggedOutIcons}
            <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active}
              to='/instructions'>
              <i className='fa-solid fa-book'></i>Instructions
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <SearchBar />
      </div>
    </>
  );
};

export default NavBar;
