import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../styles/SearchBar.module.css';

function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className={`${styles.FixedSearchContainer} mt-lg-0 mt-md-5`}>
      <i className={`fas fa-search ${styles.SearchIcon}`}></i>
      <Form
        className={styles.SearchBar}
        onSubmit={ (e) => {
          e.preventDefault();
          onSearch(query);
        }
        }>
        <Form.Control
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type='text'
          className='mr-sm-2'
          placeholder='Search events by user/title...'
        />
      </Form>
    </div>
  );
}

export default SearchBar;
